import requests
import sys

# 1. Provide your live Render URLs here (make sure there is NO trailing slash at the end)
a = "https://server-side-final-project-202602-admin.onrender.com"    # Admin service
b = "https://server-side-final-project-202602-users.onrender.com"   # Users service
c = "https://server-side-final-project-202602-costs.onrender.com"   # Costs service
d = "https://server-side-final-project-202602-dev.onrender.com"     # Dev service

# 2. Get filename from user to save output results
filename = input("filename=")

output = open(filename, "w")
sys.stdout = output

print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)

print()

print("testing getting the about")
print("-------------------------")
try:
    url = d + "/api/about/"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(data.json())
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 1")
print("------------------------------")
try:
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing adding cost item")
print("----------------------------------")
try:
    url = c + "/api/add/"
    # NOTE: This passes 'userid' in lowercase as per assignment spec
    data = requests.post(url, json={'userid': 123123, 'description': 'milk 9', 'category': 'food', 'sum': 8})
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 2")
print("------------------------------")
try:
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
except Exception as e:
    print("problem")
    print(e)

print("")