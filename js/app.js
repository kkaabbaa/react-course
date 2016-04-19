var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

var Article = React.createClass({
  propTypes: {
    author: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    bigText: React.PropTypes.string.isRequired
  },
  getInitialState: function () {
    return {
      visible: false
    };
  },
  readmoreClick: function (e) {
    e.preventDefault();
    this.setState({visible: true}, function () {
      console.log("Set state");
    });
  },
  render: function () {
    return (
        <div className="article">
          <p className="news__author">{this.props.author}:</p>
          <p className="news__text">{this.props.text}</p>
          <a href="#" onClick={this.readmoreClick}
             className={'news__readmore ' + (this.state.visible ? 'none' : '')}>
            Подробнее
          </a>
          <p className={'news__big-text ' + (!this.state.visible ? 'none' : '')}>{this.props.bigText}</p>
        </div>
    );
  }
});

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      counter: 0
    }
  },
  render: function () {
    var data = this.props.data;
    var newsTemplate;
    if (data.length > 0) {
      newsTemplate = data.map(function (item, index) {
        return (
            <div key={index}>
              <Article author={item.author} text={item.text} bigText={item.bigText}/>
            </div>
        )
      })
    } else {
      newsTemplate = <p className={data.length > 0 ? 'none' : ''}>К сожалению новостей нет</p>
    }

    return (
        <div className="news">
          {newsTemplate}
          <strong className={'news__count ' + (data.length > 0 ? '':'none') }>Всего новостей: {data.length}</strong>
        </div>
    );
  }
});

var App = React.createClass({
  render: function () {

    return (
        <div className="app">
          <h3>Новости</h3>
          <News data={my_news}/>
        </div>
    );
  }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);