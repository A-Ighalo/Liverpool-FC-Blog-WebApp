# AWS S3 Deployment Script for Angular Frontend
# This script builds and deploys the Angular frontend to AWS S3 + CloudFront

# Build the Angular application
npm run build

# Upload to S3 bucket (replace with your bucket name)
aws s3 sync dist/frontend/ s3://your-liverpool-fc-frontend-bucket --delete

# Invalidate CloudFront cache (replace with your distribution ID)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Frontend deployed successfully to S3 and CloudFront cache invalidated!"