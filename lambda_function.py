import json
import boto3
import base64
import datetime

client_bedrock = boto3.client('bedrock-runtime')
client_s3 = boto3.client('s3')

def lambda_handler(event, context):
    # 1. Get prompt
    input_prompt = event.get('prompt', '')
    print("Input prompt:", input_prompt)

    # 2. Invoke model
    response_bedrock = client_bedrock.invoke_model(
        contentType='application/json',
        accept='application/json',
        modelId='stability.sd3-5-large-v1:0',
        body=json.dumps({
            "prompt": input_prompt,
            "seed": 0,
            "output_format": "png",
            "aspect_ratio": "1:1"
        })
    )

    # 3. Read and parse the response body (StreamingBody)
    response_body_bytes = response_bedrock['body'].read()
    response_data = json.loads(response_body_bytes)
    print("Model response:", response_data)

    # 4. Extract base64 image with flexible handling
    base64_image = None
    if "base64" in response_data:
        base64_image = response_data["base64"]
    elif "artifacts" in response_data and len(response_data["artifacts"]) > 0:
        base64_image = response_data["artifacts"][0].get("base64")
    elif "images" in response_data and len(response_data["images"]) > 0:
        base64_image = response_data["images"][0]  # if it’s under 'images'

    if not base64_image:
        raise Exception("No base64 image found in model response")

    # 5. Decode base64 image
    image_bytes = base64.b64decode(base64_image)

    # 6. Create filename with proper datetime format
    poster_name = 'posterName_' + datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '.png'

    # 7. Upload to S3
    client_s3.put_object(
        Bucket='posterdesigngenai',
        Body=image_bytes,  # must be bytes
        Key=poster_name,
        ContentType='image/png'
    )
    print("Uploaded image to S3 with key:", poster_name)

    # 8. Generate presigned URL (valid for 1 hour)
    presigned_url = client_s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={'Bucket': 'posterdesigngenai', 'Key': poster_name},
        ExpiresIn=3600
    )
    print("Generated presigned URL:", presigned_url)

    # 9. Return presigned URL
    return {
        'statusCode': 200,
        'body': presigned_url
    }
