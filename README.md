Project name: Ensemble
Vercel link: https://final-project-zeta-ruddy.vercel.app/
Repo link: https://github.com/rosiecorio/final-project

Team members: Ahmed, Aishah, Rosie & Sufyan

Project description:
# Ensemble 🎵  
*A social app for local musicians to connect!*  

Ensemble is a **Next.js** server-side rendered (SSR) app deployed on **Vercel**, designed to help local musicians connect and collaborate.

Problem domain: 
All platforms aimed at musicians  we could find were paid services, subscription servers, exclusive content for fans or event platforms.
We wanted to create a platform just for musicians, which was less about promotion, more about networking and connecting with local artists.

User stories:
As a user, I want to access threads for specific industry advice and help
As a user, I want to create a profile showcasing my genre, instruments, and experience so that I can connect with like-minded artists.


Wireframe: See Figma for these: https://www.figma.com/board/8kebz8JlJpU03uOnlOP4IA/Week_11?node-id=0-1&p=f&t=RHcP149nxpHZRzZr-0

A list of any libraries, frameworks, or packages that your application requires in order to properly function:
Express.js, pg, cors...

Instructions on how to run your app:

## 📦 Installation  
1. Clone the repo:  
   ```sh
   git clone https://github.com/yourusername/ensemble.git
   cd ensemble
   npm install
   npm run dev

🚀 Deployment
Deployed on Vercel – push to main and it updates automatically!

Lighthouse report: 94%

Reflections:

Please mention the requirements you met and which goals you achieved for this assignment.

Successfully implemented Next.js SSR with dynamic routing.

Integrated Clerk for user authentication and authorization.

Styled the application using Tailwind CSS and ShadCN components.

Connected and managed a Postgres database via Supabase.

Deployed the project successfully on Vercel.

Created a responsive and intuitive user interface.

Used Git & GitHub for collaboration and version control.


🎯 Were there any requirements or goals that you were not quite able to achieve?

Persistent Sidebar Issue: Initially, the sidebar affected page formatting and introduced multiple scrollbars. Solved by refining layout structure.

Database Query Optimization: Some queries initially caused slow responses, requiring adjustments to indexing and Supabase configurations.

User Experience Improvements: Some UI elements needed refinement to enhance navigation clarity and accessibility.



 
What went really well and what could have gone better?

What went well?
Authentication setup with Clerk was smooth and integrated well with the database.

Using ShadCN & Radix UI made UI development faster and more consistent.

Deployment on Vercel was seamless with automatic updates on main branch pushes.

What Could Have Gone Better?
Better Initial Planning: More detailed wireframes and database schema design upfront could have prevented some restructuring later.

Error Handling: More robust backend error handling could improve user experience.


Errors & Bugs Encountered
Multiple Scrollbars Issue: Resolved by ensuring the sidebar and main content shared a single overflow container.

Footer Overlapping Content: Fixed by restructuring the layout and setting flex-grow properties correctly.

Session Persistence Issues: Encountered issues where user sessions would sometimes not persist correctly; resolved by adjusting Clerk settings.


References:

Useful Resources
Next.js Documentation (nextjs.org)

Clerk Authentication Guide (clerk.com)

ShadCN Components (shadcn/ui)

YouTube Tutorials: Various tutorials on Next.js SSR, Supabase, and Clerk were helpful for debugging and best practices.
