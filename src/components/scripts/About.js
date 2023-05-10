import React from 'react';
import '../styles/About.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Recipes Collection</h1>
      <p className="about-text">Welcome to Recipes Collection, a website dedicated to bringing you delicious recipes from all over the world. Our goal is to provide you with easy-to-follow recipes that you can make at home, whether you're an experienced cook or just starting out.</p>
      <h2 className="about-subtitle">About Sai Manikanta</h2>
      <div className="about-sai">
        <img className="about-image" src="/images/myimage.png" alt="Sai Manikanta" />
        <p className="about-text">
          i am Sai Manikanta, and I completed my B-tech graduation at audisankara institute of technology . As part of my final project, I created Recipes Collection  web application using the MERN stack (MongoDB, Express, React, and Node.js) to showcase my passion for web development.
          <br />
          <br />
          You can check out my portfolio <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
      <h2 className="about-subtitle">Project Details</h2>
      <p className="about-text">Recipes Collection is a web application that allows users to browse, search, and save recipes from various categories such as breakfast, lunch, dinner, snacks, and desserts. Users can also create an account to save their favorite recipes and share them with others.</p>
      <p className="about-text">The project was developed by me. it takes 1 and half month  to complete the entire project</p>
      <h2 className="about-subtitle">Contact Us</h2>
      <p className="about-text">If you have any questions, comments, or suggestions, please feel free to contact us at <a href="mailto:manifreelancer25@gmail.com">manifreelancer25@gmail.com</a>. We would love to hear from you and are always looking for ways to improve our website.</p>
      <p className="about-text" style={{color:'rgb(223, 35, 110)'}}>Thank you for visiting Recipes Collection and happy cooking!</p>
    </div>
  );
}

export default AboutPage;
