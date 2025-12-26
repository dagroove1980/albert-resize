#!/usr/bin/env python3
"""Quick test to check if models exist"""

import requests
import time

import os
API_KEY = os.getenv('REPLICATE_API_TOKEN', '')
API_BASE = 'https://api.replicate.com/v1'

models_to_test = [
    'pipeline-example/outpainter',
    'qwen/qwen-image-edit-plus',
    'bytedance/eededit-3.0',
    'luma/reframe-image',
    'arielreplicate/paella_fast_outpainting',
    'batouresearch/sdxl-outpainting-lora',
    'google/gemini-2.5-flash-image',
    'black-forest-lab/flux-kontext-pro'
]

headers = {'Authorization': f'Token {API_KEY}'}

print('Testing models for existence...\n')
working_models = []

for model in models_to_test:
    try:
        url = f'{API_BASE}/models/{model}'
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            print(f'✅ {model}')
            desc = data.get('description', 'N/A')
            if len(desc) > 100:
                desc = desc[:100] + '...'
            print(f'   {desc}')
            working_models.append({
                'model': model,
                'name': model.split('/')[-1].replace('-', ' ').title(),
                'description': desc
            })
        else:
            print(f'❌ {model} - Status: {response.status_code}')
            if response.status_code == 404:
                print(f'   Model not found')
    except Exception as e:
        print(f'❌ {model} - Error: {str(e)}')
    print()
    time.sleep(0.5)  # Small delay between requests

print(f'\n✅ Found {len(working_models)} working models:\n')
for m in working_models:
    print(f'  {m["model"]} - {m["name"]}')

