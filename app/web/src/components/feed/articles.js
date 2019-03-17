import React, { Component } from 'react';
import SummaryCard from '../common/summary_card';
import { getSearchResults } from '../../actions/search';

class Articles extends Component {

  constructor(props) {
    super(props);

    this.state = { };
  }

  renderItem(arxivArticle, index) {
    let { titles, authors, summaries, urls, interested, dates, categories } = arxivArticle;

    let card = <div key={index} className="article-card">
      <SummaryCard 
        keyValue={index}
        // buttonLabel="Details"
        buttonLabel={<i className="fas fa-info-circle"></i>}
        title={titles[0]}
        url={urls[0]}
        authors={authors}
        summary={summaries[0]}
        categories={categories}
        interested={interested}
      />
    </div>;
    return card
  }

  renderItems() {
    if (!this.props.loading && this.props.data) {
      // console.log(this.props.data);
      let articles = this.props.data.data.articles;
      return articles.map((article, index) => {return this.renderItem(article, index);})
    }
    return null
  }

  render() {
    return (
      <section className="article-feed">
        {this.renderItems()}
      </section>
    )
  }
}

export default Articles;