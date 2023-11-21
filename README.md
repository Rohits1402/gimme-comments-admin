# Gimme Comments 
> Providing Comments as a Service

## Table of Contents 📕
- [Gimme Comments](#gimme-comments)
- [Components](#components)
- [Flow of Application](#flow-of-application)
- [Documents](#documents)
- [Tools and Technology](#tools-and-technology)
- [Live Examples](#live-examples)

# Gimme Comments

This project aims to demonstrate the working of a server providing comments as a service. We
will provide this service with a website called Gimme Comment that provides comment box
functionality to other third-party websites that do not intend to create their comment box. 


## Components

* Gimme Comments Admin ( [Github Link](https://github.com/Proj-Beluga/gimme-comments-admin) | [See live](https://gimme-comments-admin.vercel.app/) )
* Gimme Comments Server ( [Github Link](https://github.com/Proj-Beluga/gimme-comments-server) | [See live](https://gimme-comments-server.onrender.com/) )
* Gimme Comments Client ( [Github Link](https://github.com/Proj-Beluga/gimme-comments-client) )

## Flow of Application

| Application Flow | Authentication Flow |
| ---------------- | ------------------- |
| <img width="1604" alt="Home Page" src="https://raw.githubusercontent.com/Proj-Beluga/gimme-comments-admin/main/Assets/ApplicationFlow.png">  Application Flow | <img width="1604" alt="Home Page" src="https://raw.githubusercontent.com/Proj-Beluga/gimme-comments-admin/main/Assets/AuthenticationFlow.png">  Authentication Flow |

## Documents

* [Presentation](https://raw.githubusercontent.com/Proj-Beluga/gimme-comments-admin/main/Assets/GimmeCommentsPresentation.pdf)
* [Report](https://raw.githubusercontent.com/Proj-Beluga/gimme-comments-admin/main/Assets/GimmeCommentsReport.pdf)

## Tools and Technology

* The Front-end is created in **React.js** and **Bootstrap**. 
* For creating Back-end, we used **Express and Nodejs**. For the database, we used **MongDB Atlas**. We created a very flexible and versatile foundation for our codebase, so that in future its functionality could be easily extended and new agents could be easily added into it.
* For hosting we used **Vercel** for Admin Panel and **Render** for server hosting which is a cloud platform that enables developers to host websites and web services that deploy instantly, scale automatically, and require no supervision.
* Other technologies includes **AWS S3** bucket for storing profile images of users and **Send Grid** email service for user verification using OTP.
