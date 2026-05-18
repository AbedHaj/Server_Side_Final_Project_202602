import unittest
import requests
import random


ADMIN_URL = 'http://localhost:3001/api'
USER_URL = 'http://localhost:3002/api'
COST_URL = 'http://localhost:3003/api'
DEV_URL = 'http://localhost:3004/api'

class TestBackendAPI(unittest.TestCase):

    # FIXTURE: Prepare common data before every test case
    def setUp(self):
        self.headers = {'Content-Type': 'application/json'}
        # Generating a random ID to avoid 'duplicate key' errors in MongoDB during testing
        self.test_user_id = random.randint(10000, 99999)
        self.test_user = {
            'id': self.test_user_id,
            'first_name': 'Test',
            'last_name': 'Subject',
            'birthday': '1990-01-01'
        }

    # 1. DEV API TESTS (dev_api.js)
    def test_about_endpoint(self):
        '''Verify the 'About' page returns the correct team members.'''
        response = requests.get(f'{DEV_URL}/about')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(any(member['last_name'] == 'Haj Yahia' for member in data))

    # 2. USERS API TESTS (users_api.js)
    def test_user_lifecycle(self):
        '''Verify adding a user and then retrieving their specific details.'''

        add_response = requests.post(f'{USER_URL}/add', json=self.test_user)
        self.assertEqual(add_response.status_code, 201)

        specific_user_response = requests.get(f'{USER_URL}/users/{self.test_user_id}')
        self.assertEqual(specific_user_response.status_code, 200)

        all_users_response = requests.get(f'{USER_URL}/users')
        self.assertEqual(all_users_response.status_code, 200)

        data = specific_user_response.json()
        self.assertEqual(data['first_name'], 'Test')
        self.assertIn('total', data)

    # 3. COST API TESTS (cost_api.js)
    def test_add_cost_and_report(self):
        '''Verify adding a cost and checking the generated report.'''

        cost_item = {
            'description': 'Lab Equipment',
            'category': 'education',
            'userid': self.test_user_id,
            'sum': 150
        }
        add_response = requests.post(f'{COST_URL}/add', json=cost_item)
        self.assertEqual(add_response.status_code, 201)


        cost_url = f'{COST_URL}/report?id={self.test_user_id}&year=2026&month=5'
        report_response = requests.get(cost_url)
        self.assertEqual(report_response.status_code, 200)

        report_data = report_response.json()
        self.assertEqual(report_data['userid'], self.test_user_id)
        costs_list = report_data['costs']
        education_cat = next(item for item in costs_list if 'education' in item)
        self.assertTrue(len(education_cat['education']) > 0)


    # 4. ADMIN API TESTS (admin_api.js)
    def test_admin_logs(self):
        '''Verify the admin can retrieve system logs.'''
        response = requests.get(f'{ADMIN_URL}/logs')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

if __name__ == '__main__':
    unittest.main(verbosity=2)