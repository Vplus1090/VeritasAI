# backend/main.py
import json
import os
import re
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pypdf import PdfReader
from io import BytesIO
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- CONFIGURATION ---
API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")
client = Groq(api_key=API_KEY)
MODEL_NAME = "llama-3.1-8b-instant"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
# These field names MUST match exactly what frontend/src/App.jsx sends
class JusticeInput(BaseModel):
    accountant_analysis: str
    legal_analysis: str
    skeptic_analysis: str
    bloodhound_analysis: str

# --- HELPERS ---
def extract_text(file_bytes):
    try:
        reader = PdfReader(BytesIO(file_bytes))
        text = ""
        # Reduced to 5 pages to save tokens and avoid Rate Limits
        for i in range(min(5, len(reader.pages))):
            text += reader.pages[i].extract_text() or ""
        return text
    except Exception:
        return ""

def parse_json_output(content: str):
    """
    Robust JSON parser that handles Markdown blocks and bad formatting.
    """
    try:
        # 1. Strip Markdown code blocks
        clean_content = re.sub(r"```json\s*", "", content)
        clean_content = re.sub(r"```", "", clean_content)
        
        # 2. Extract JSON object using regex (find outermost braces)
        # This handles cases where the LLM adds chatter before/after the JSON
        json_match = re.search(r'\{.*\}', clean_content, re.DOTALL)
        if json_match:
            clean_content = json_match.group(0)
            
        return json.loads(clean_content)
    except json.JSONDecodeError:
        # 3. Fallback: If strict JSON fails, try to construct a safe object
        print(f"JSON PARSE ERROR. RAW CONTENT:\n{content}\n") # Log for debug
        return {
            "analysis": content, 
            "risk_score": 0,
            "verdict": "ERROR",
            "confidence_score": 0
        }

def analyze_with_groq(system_persona: str, prompt_task: str, content: str, justice_mode: bool = False):
    """
    Helper to send a request to Groq with a specific persona and task.
    Enforces JSON structure.
    """
    
    # Different instructions for Justice vs Standard Agents
    if justice_mode:
        format_instruction = """
        IMPORTANT: RESPONSE MUST BE VALID JSON ONLY. NO MARKDOWN BLOCK. NO CHATTER.
        Structure:
        {
            "verdict": "BUY", "SELL", or "HOLD",
            "confidence_score": 0 to 100 (integer),
            "analysis": "A summary of the verdict..."
        }
        """
    else:
        format_instruction = """
        IMPORTANT: RESPONSE MUST BE VALID JSON ONLY. NO MARKDOWN BLOCK. NO CHATTER.
        Structure:
        {
            "analysis": "Markdown text here...",
            "risk_score": 0 to 100 (integer)
        }
        """
        
    full_prompt = f"""
    SYSTEM ROLE: {system_persona}
    TASK: {prompt_task}
    
    {format_instruction}
    
    CONTENT TO ANALYZE:
    {content}
    """
    
    try:
        # Using a lower temperature for determinism
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": f"You are {system_persona}. You only speak in JSON."}, 
                {"role": "user", "content": full_prompt}
            ],
            model=MODEL_NAME,
            temperature=0.2, 
            max_tokens=1024,
            response_format={"type": "json_object"} # Force JSON mode if supported
        )
        response_content = chat_completion.choices[0].message.content
        return parse_json_output(response_content)
        
    except Exception as e:
        print(f"API ERROR: {str(e)}")
        return {"analysis": f"API ERROR: {str(e)}", "risk_score": 0, "verdict": "ERROR"}

# --- ENDPOINTS ---

@app.post("/analyze/accountant")
async def analyze_accountant(file: UploadFile = File(...)):
    content = await file.read()
    raw_text = extract_text(content)[:15000]
    return analyze_with_groq(
        "Forensic Accountant", 
        "Find revenue anomalies and 'creative accounting'. Calculate Beneish M-Score factors.", 
        raw_text
    )

@app.post("/analyze/legal")
async def analyze_legal(file: UploadFile = File(...)):
    content = await file.read()
    raw_text = extract_text(content)[:15000]
    return analyze_with_groq(
        "Legal Hunter", 
        "Find toxic clauses, liability traps, and bad indemnity terms.", 
        raw_text
    )

@app.post("/analyze/skeptic")
async def analyze_skeptic(file: UploadFile = File(...)):
    content = await file.read()
    raw_text = extract_text(content)[:15000]
    return analyze_with_groq(
        "Competitive Skeptic", 
        "Compare claims to industry reality. Find weaknesses in their moat.", 
        raw_text
    )

@app.post("/analyze/bloodhound")
async def analyze_bloodhound(file: UploadFile = File(...)):
    content = await file.read()
    raw_text = extract_text(content)[:15000]
    return analyze_with_groq(
        "Compliance Bloodhound", 
        "Scan for: Litigation, DOJ, SEC, Subpoena, Environmental Violation, GDPR.", 
        raw_text
    )

@app.post("/analyze/justice")
async def analyze_justice(inputs: JusticeInput):
    # Combine inputs but truncate them to fit context window
    combined_content = f"""
    ACCOUNTANT: {inputs.accountant_analysis[:3000]}
    LEGAL: {inputs.legal_analysis[:3000]}
    SKEPTIC: {inputs.skeptic_analysis[:3000]}
    BLOODHOUND: {inputs.bloodhound_analysis[:3000]}
    """
    
    return analyze_with_groq(
        "Chief Justice",
        "Synthesize these reports. Resolve conflicts. Issue a final verdict.",
        combined_content,
        justice_mode=True
    )