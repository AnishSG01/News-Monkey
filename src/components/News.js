import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {


    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)}  - News-Monkey`;
    }


    async componentDidMount() {
        this.props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ecf8ebf1ad464539b8911ab7cf757070&page=1&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json();
        this.props.setProgress(70);
        
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        })
        this.props.setProgress(100);
    }



    // async updateNews(){
        
    //     const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ecf8ebf1ad464539b8911ab7cf757070&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //     this.setState({ loading: true });
    //     let data = await fetch(url);
    //     let parsedData = await data.json();

        
    //     this.setState({
    //         articles: parsedData.articles,
    //         totalResults: parsedData.totalResults,
    //         loading: false
    //     })
    //     console.log(this.state);
        
    // }

    // handlePrevClick = async () => {
    //     this.setState({page: this.state.page-1});
    //     this.updateNews();
    // }
    // handleNextClick = async () => {
    //     this.setState({page: this.state.page+1});
    //     this.updateNews();
    // }

    fetchMoreData = async() => {
        this.setState({page: this.state.page+1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ecf8ebf1ad464539b8911ab7cf757070&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();

        
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            loading: false
        })
      };

    render() {
        return (
            <>
                <h1 className='text-center' style={{ margin: '35px 0px' }}>News-Monkey Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>

                
                 <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>} 
                >
                    <div className='container my-3'>
                    <div className="row">
                        {this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} imageURL={element.urlToImage} description={element.description ? element.description : ""} url={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt} source={element.source.name} />
                            </div>

                        })}
                    </div>
                    </div>
                </InfiniteScroll>
                 {/* <div className="container d-flex justify-content-between">
                     <button disabled={this.state.page <= 1} type="button" onClick={this.handlePrevClick} className="btn btn-primary">Previous</button>
                     <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-primary">Next</button>
                 </div> */}
                </>
        )
    }
}

export default News