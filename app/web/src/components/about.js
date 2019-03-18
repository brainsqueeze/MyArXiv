import React from 'react';

const About = (props) => {
  return (
    <section className="about">
      <section className="summary">
        <h1>About</h1>
      </section>
      <section className="content">
        <p>
          This is a personal project for getting convenient access to articles posted to the arXiv in different 
          categories of interest. The main goal is to build a dataset of arXiv articles and interested/not-interested 
          classifications in order to build a recommendation machine learning model to suggest new articles of interest 
          to myself given the text in the article title and abstract.
        </p>

        <p>
          This is not a replacement for <a href="https://arxiv.org" target="_blank">arXiv</a>, and the 
          features here are very limited by comparison. The advantage of this platform is the eventual ability to 
          send recommended articles by email based on past preferences.
        </p>

        <p>
          For questions please contact myself - Dave Hollander - 
          through <a href="https://github.com/brainsqueeze/MyArXiv/issues" target="_blank">GitHub page</a> for this project.
        </p>
      </section>
    </section>
  )
}

export default About;