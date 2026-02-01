
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"
PDF_PATH = "dummy.pdf"

def test_endpoint(name, endpoint, files=None, json_data=None):
    print(f"--- Testing {name} ({endpoint}) ---")
    try:
        response = None
        if files:
            files['file'] = open(PDF_PATH, 'rb') # Re-open for each request
            response = requests.post(f"{BASE_URL}{endpoint}", files=files)
        elif json_data:
            response = requests.post(f"{BASE_URL}{endpoint}", json=json_data)
        else:
            print("No data provided")
            return None
        
        if response.status_code == 200:
            print(f"SUCCESS: {response.status_code}")
            try:
                data = response.json()
                # v2 Validation
                if endpoint == "/analyze/justice":
                    if "verdict" in data and "confidence_score" in data:
                        print(f"Verdict: {data['verdict']} (Confidence: {data['confidence_score']})")
                        return data
                    else:
                        print("FAILED VALIDATION: Missing 'verdict' or 'confidence_score'")
                else:
                    if "analysis" in data and "risk_score" in data:
                        print(f"Risk Score: {data['risk_score']}")
                        print(f"Analysis Snippet: {data['analysis'][:100]}...")
                        return data['analysis']
                    else:
                        print("FAILED VALIDATION: Missing 'analysis' or 'risk_score'")
            except Exception as e:
                print(f"Raw response: {response.text[:200]}")
                print(f"JSON Parsing Error: {e}")
                return None
        else:
            print(f"FAILURE: {response.status_code}")
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"EXCEPTION: {str(e)}")
        return None

def run_tests():
    # Test Accountant
    accountant_res = test_endpoint("Accountant", "/analyze/accountant", files={'file': open(PDF_PATH, 'rb')})
    
    # Test Legal
    legal_res = test_endpoint("Legal", "/analyze/legal", files={'file': open(PDF_PATH, 'rb')})
    
    # Test Skeptic
    skeptic_res = test_endpoint("Skeptic", "/analyze/skeptic", files={'file': open(PDF_PATH, 'rb')})

    # Test Bloodhound (NEW)
    bloodhound_res = test_endpoint("Bloodhound", "/analyze/bloodhound", files={'file': open(PDF_PATH, 'rb')})
    
    if accountant_res and legal_res and skeptic_res and bloodhound_res:
        # Test Justice
        justice_payload = {
            "accountant_analysis": accountant_res,
            "legal_analysis": legal_res,
            "skeptic_analysis": skeptic_res,
            "bloodhound_analysis": bloodhound_res
        }
        test_endpoint("Justice", "/analyze/justice", json_data=justice_payload)
    else:
        print("Skipping Justice test due to previous failures.")

if __name__ == "__main__":
    run_tests()
