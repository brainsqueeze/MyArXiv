import React, { Component } from 'react';
import SummaryCard from '../common/summary_card';
import { getSearchResults } from '../../actions/search';

class Articles extends Component {

  constructor(props) {
    super(props);

    this.state = { };
  }

  renderItem(arxivArticle, index) {
    let { titles, authors, summaries, urls, dates, categories } = arxivArticle;

    let card = <div key={index} className="article-card">
      <SummaryCard 
        keyValue={index}
        buttonLabel="See details"
        title={titles[0]}
        url={urls[0]}
        authors={authors}
        summary={summaries[0]}
      />
    </div>;
    return card
  }

  renderItems() {
    if (!this.props.loading && this.props.data) {
      // console.log(this.props.data);
      let articles = this.props.data.data.articles;

      let output = <section className="article-feed">
        {articles.map((article, index) => {return this.renderItem(article, index);})}
      </section>;

      return output
    }
    return null
  }

  render() {
    let items = this.renderItems();
    return items;
  }
}

// function mapStateToProps (state) {
//   return {
//     search: state.search,
//     results: state.search.results
//   };
// }

// export default connect(mapStateToProps, {getSearchResults})(Articles);
export default Articles;