# TeamGraduate
This Repository holds the developments made in the improvement of #TeamGraduates website through the use of AI.
This guide should give some basic steps on how to get started with GitHub

## Table of Contents
- [What is GitHub?](#what-is-github)
- [Setting Up GitHub](#setting-up-github)
- [Basic GitHub Terminology](#basic-github-terminology)
- [Creating a Repository](#creating-a-repository)
- [Cloning a Repository](#cloning-a-repository)
- [Making Changes and Committing](#making-changes-and-committing)
- [Pushing Changes to GitHub](#pushing-changes-to-github)
- [Pull Requests](#pull-requests)
- [Using Branches](#using-branches)
- [Flowchart](#flowchart)

---

## What is GitHub?

GitHub is a cloud-based platform that allows developers to host and review code, manage projects, and collaborate on software development. It is built on top of Git, a version control system that helps track changes to code and allows multiple people to work on the same project simultaneously. It allows multiple developers to work on projects together efficiently and it tracks all of our changes so don't be afraid to make mistakes and edits because they can always be reverted. :)

Docs: https://github.com/git-guides

---

## Setting Up GitHub

1. **Sign Up for GitHub**  
   Go to [GitHub.com](https://github.com) and create an account.

2. **Install Git**  
   Git is the version control system that GitHub uses. You need to install Git on your computer:
   - Download Git from [git-scm.com](https://git-scm.com/downloads).
   - Follow the installation instructions for your operating system.

3. **Configure Git**  
   Once Git is installed, configure it by setting your name and email address:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

---

## Basic GitHub Terminology
- **Repository (Repo):** A collection of files and their version history. Our Repo is everything here on GitHub.
- **Clone:** A copy of a repository that you can work on locally. You need to do this first before you can make edits. (All edits you make are on your own local repository and then you push your changes to the GitHub) Also can be used for saving copys/backups (probably not needed).
- **Commit:** A snapshot of your changes that you save to your local repository. This is like quicksaving changes that you made with a small comment with the details of your changes. Only saves locally! Should be done before pushing changes to the GitHub.
- **Push:** Uploading your changes from your local repository to GitHub. All the commits you have made before your previous Push will be uploaded to the GitHub.
- **Pull:** Downloading changes from the Remote Repo into your local Repo
- **Pull Request (PR):** A request to merge changes from one branch to another, typically for code review and collaboration. (You are sending a request for the Remote repo to pull in and approve your changes)
- **Fork:** A personal copy of someone else's repository. This can be done if you want to make changes and edits on your own without effecting the original repo. (Probably won't use)
- **Branch:** A separate version of your repository, allowing you to work on different features independently. 

---

## Creating a Repository
- Go to your GitHub account.
- Click on the + button at the top right corner of the screen and select New repository.
- Fill in the repository name, description, and visibility (public or private).
- Click Create repository.

---

## Cloning a Repository
To clone a repository, you need the URL of the repo. Here's how to clone it to your local machine:
```bash
git clone https://github.com/your-username/TeamGraduate.git
```
Replace 'your-username' with your actual username. Seen in the url at the top of your screen or in profile.

---

## Making Changes and Committing
1. Make changes to files in your local repository.
2. Use git status to check which files have been modified.
3. Add the files you want to commit:
   ```bash
   git add filename
   ```
  > or add all files
  ```bash
  git add .
  ```
4. Commit the changes (try to always commit with the message)
  ```bash
  git commit -m "message of changes goes here"
  ```

---

## Pushing Changes to GitHub
After committing your changes, push them to GitHub:
```bash
git push develop main
```
This command takes all of the changes from the 'develop' branch and moves them to the 'main' branch as well. 

```bash
git push develop origin
```
This command takes all of the changes that were on the develop branch and merges them into your current branch

---

## Pulling Changes from GitHub
This is for when you want to pull changes from the Github into your local version. You should do this everytime before you start working on your new branch just to be safe.

```bash
git pull
```
This command pulls all changes that were made by other people.

---

## Pull Requests
A Pull Request is used to propose changes to a repository. To create a pull request:

1. Fork a repository or clone it to your local machine.
2. Create a new branch to make changes.
3. Push your changes to your fork or branch.
4. Go to the GitHub repository, and click on **New Pull Request**.
5. Provide a title and description of your changes, and submit the pull request for review.

You are basically pushing your changes to the GitHub however in this case, instead of the changes being directlt integrated, they are just posted as a suggestion and not fully integrated into our Repository until one of us approves it on GitHub.

### Difference between Pull and Push?
- 'Pull' (Remote->Local) You want to pull all changes into your branch you are working on to make sure it is the most up to date. 
- 'Push' (Local->Remote) You want to push your changes from your local 

---

## Using Branches
Branches allow you to work on new features or fixes without affecting the main codebase.

```bash
git checkout branch-name
```
This command will switch your current branch to the one selected or creates a new branch by this name if no branch is found.

```bash
git switch branch-name
```
This command does the same thing however I believe if it does not exist it will not create a new branch. (For newer version of git)

There are 2 permanent Branches and then a couple other types of branches. Just so the naming convention is the same and to avoid confusion these are some conventions. 

- The 'main' branch should be the latestest complete working version of our project. (Only the develop branch should be pushed here.)
- The 'develop' branch should be the place where we make our changes that we think are finshed but may need some testing before being pushed to the 'main' branch.
- If you want to add a new feature to our website the name should be 'feature/*' (where the * is the title of the new feature being added). This branch is generally made off of the 'develop' branch.
- If you want to fix a bug than the name can be 'bug/*' (where the * describes the bug fix).

---

## Flowchart
![image](https://github.com/user-attachments/assets/0c9475f1-811e-48bc-af78-51808ab193b9)
