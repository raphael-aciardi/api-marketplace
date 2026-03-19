git init
git add package.json yarn.lock tsconfig.json tsconfig.build.json nest-cli.json .eslintrc.js .prettierrc .gitignore src/main.ts src/app.* test/
git commit -m "chore: initial nestjs project setup"

git add prisma src/prisma
git commit -m "feat: setup prisma and sqlite schema"

git add src/users
git commit -m "feat: implement users crud operations"

git add src/auth src/common
git commit -m "feat: implement jwt authentication and route guards"

git add README.md
git commit -m "docs: add project readme"

git add .
git commit -m "chore: stage remaining environment files and configurations"
