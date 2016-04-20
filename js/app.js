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

window.ee = new EventEmitter();

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
  getInitialState: function () {
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
          <strong
              className={'news__count ' + (data.length > 0 ? '':'none') }>
            Всего новостей: {data.length}
          </strong>
        </div>
    );
  }
});

var Add = React.createClass({
  componentDidMount: function () {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },
  getInitialState: function () {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    }
  },
  onAuthorChange: function (e) {
    this.setState({
      authorIsEmpty: !(e.target.value.trim().length > 0)
    });
  },
  onTextChange: function (e) {
    this.setState({
      textIsEmpty: !(e.target.value.trim().length > 0)
    });
  },
  onFieldChange: function (fieldName, e) {
    this.setState({
      ['' + fieldName]: !(e.target.value.trim().length > 0)
    });
  },
  onCheckRuleClick: function () {
    this.setState({
      agreeNotChecked: !this.state.agreeNotChecked
    })
  },
  onBtnClickHandler: function (e) {
    e.preventDefault();
    var textEl = ReactDOM.findDOMNode(this.refs.text);

    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var text = textEl.value;

    var item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);
    textEl.value = '';
    this.setState({textIsEmpty: true});
  },
  render: function () {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty;
    return (
        <div className="container">
          <form className="add cf">
            <input
                onChange={this.onFieldChange.bind(this,'authorIsEmpty')}
                defaultValue=""
                className='add__author'
                placeholder='Ваше имя'
                ref='author'
            />
            <textarea
                onChange={this.onFieldChange.bind(this,'textIsEmpty')}
                className="add__text"
                defaultValue=""
                placeholder="Текст новости"
                ref="text">
            </textarea>
            <label className='add__checkrule'>
              <input
                  onChange={this.onCheckRuleClick}
                  type='checkbox'
                  defaultChecked={false}
                  ref='checkrule'/>Я согласен с правилами
            </label>
            <button
                disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
                className='add__btn'
                onClick={this.onBtnClickHandler}
                ref='alert_button'>
              Добавить новость
            </button>
          </form>
        </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      news: my_news
    }
  },
  componentDidMount: function () {
    var self = this;
    window.ee.addListener('News.add', function (item) {
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },
  componentWillUnmount: function () {
    window.ee.removeListener('News.add');
  },
  render: function () {
    console.log("render App");
    return (
        <div className="app">
          <h3>Новости</h3>
          <Add />
          <News data={this.state.news}/>
        </div>
    );
  }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);