This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Monthly Progress Email Automation

To send users a monthly summary of their workout progress and login stats via email:

### 1. Environment Variables
Create a `.env` file in the project root with the following:

```
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER_EMAIL=your_verified_sender@example.com
```

### 2. Manual Run
To send the emails manually, run:
```
node scripts/monthlyProgressEmail.js
```

### 3. Automate (Windows Task Scheduler)
1. Open Task Scheduler and create a new task.
2. Set the trigger to run monthly (e.g., first day of each month).
3. Set the action to run:
   - Program/script: `node`
   - Add arguments: `scripts/monthlyProgressEmail.js`
   - Start in: `C:\Users\Andre\Documents\GitHub\grow a muscle\grow-a-muscle`
4. Make sure your `.env` file is present in the project root.

### 4. Automate (GitHub Actions)
If your project is on GitHub, you can use a scheduled workflow. Example `.github/workflows/monthly-email.yml`:

```yaml
name: Monthly Progress Email
on:
  schedule:
    - cron: '0 8 1 * *' # 8:00 AM UTC, 1st of every month
jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Set up environment
        run: |
          echo "SUPABASE_SERVICE_ROLE_KEY=${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" >> .env
          echo "SENDGRID_API_KEY=${{ secrets.SENDGRID_API_KEY }}" >> .env
          echo "SENDGRID_SENDER_EMAIL=${{ secrets.SENDGRID_SENDER_EMAIL }}" >> .env
      - name: Run script
        run: node scripts/monthlyProgressEmail.js
```

Add your secrets in the GitHub repository settings.
