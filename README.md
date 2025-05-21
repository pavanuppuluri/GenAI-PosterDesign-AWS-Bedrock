# AgenticAI-PosterDesign

## GenAI Use Case - Generate a Poster as per given user prompt

#### Steps include
- Create an S3 bucket
  
- Create an AWS Lambda Function
  - Connect to AWS Bedrock
  - Store the image as an Object in S3
  - Generate a Pre-signed URL for the generated image
  - Send the URL as a Response to AWS API Gateway
    
- Create a REST API using AWS API Gateway to allow user to pass the prompt and view the image using Pre-signed URL


