var React = require('react');
var outletStore = require('../stores/outletStore');
var userStore = require('../stores/userStore');
var ConnectusDispatcher = require('../dispatcher/ConnectusDispatcher');
var Link = require('react-router').Link;
var Router = require('react-router'); //need this for redirection
var mobile = require('./mobilecheck');
var FooterCheck = require('./footerCheck');

// Allow user to view and edit all of the outlets they manage

var myOutlets = React.createClass({

  getInitialState: function(){
    return {
      data: []
    };
  },

  mixins: [Router.Navigation], //makes the router navigation information available for use (need this for redirection)

  componentDidMount: function() {
    FooterCheck.checker();
    var that = this;
    outletStore.getSellerOutlets().then(function(outletData){
      outletData.map(function(outlet){
        userStore.getUsernameById(outlet.seller_id).then(function(user){
          outlet['seller'] = user.fullname;
          that.setState({data: outletData});
        });
      });
    });
  },

  render: function() {

    // is the user authenticated?
    if(!document.cookie){
      this.transitionTo('about');
      return <h1></h1>;
    }

    var isMobile = mobile();

    var that = this;
    // Outlet data list
    if (this.state.data.length !==0) {
      if(isMobile) {
        var outletHtml = this.state.data.map(function(outlet) {
          return (
            <div>
            <tr key={outlet.id} onClick={that.editOutlet}>
              <td>
                <h3> 
                  <Link to="editOutlet" params={{id: outlet.id }}>
                    { outlet.name } 
                  </Link>
                </h3>
              </td>
              <td>
                <h5>Voltage:</h5> 
                <p className="description-text">{ outlet.voltage }</p>
              </td>
              <td>
                <h5>Pricing: </h5>
                <p className="description-text">${ outlet.priceHourly }/hr</p>
                <p className="description-text">${ outlet.priceEnergy }/kWh</p>
              </td>
              <td>
                <h5>Description:</h5> 
                <p className="description-text">{ outlet.description }</p>
                <p className="rating">{ outlet.rating }</p>
              </td>
            </tr>
            <tr>
              <td>
                <button>
                  <Link to="editOutlet" params={{id: outlet.id }}>
                    Edit
                  </Link>
                </button>
              </td>
            </tr>
            </div>
          )
        });
      } else {
        var outletHtml = this.state.data.map(function(outlet) {
          return (
            <tr key={outlet.id} onClick={that.editOutlet}>
              <td>
                <h3> 
                  <Link to="editOutlet" params={{id: outlet.id }}>
                    { outlet.name } 
                  </Link>
                </h3>
              </td>
              <td>
                { outlet.voltage }
              </td>
              <td>
                <p>${ outlet.priceHourly }/hr</p>
                <p>${ outlet.priceEnergy }/kWh</p>
              </td>
              <td>
                <p>{ outlet.description }</p>
                <p className="rating">{ outlet.rating }</p>
              </td>
              <td>
                <button>
                  <Link to="editOutlet" params={{id: outlet.id }}>
                    Edit
                  </Link>
                </button>
              </td>
            </tr>
          )
        });
      }
    }

    if(isMobile) {
      var tableHead = (
        <table className="table table-hover">
        <tbody>
          { outletHtml }
        </tbody>
      </table>
      )
    } else {
      var tableHead = (
        <table className="table table-hover">
          <thead>
            <tr><th className="single line">Outlet Name</th>
            <th>Voltage</th>
            <th>Price</th>
            <th>Description</th>
          </tr></thead>
        <tbody>
          { outletHtml }
        </tbody>
      </table>
      )
    }
    
    // includes search bar, map/list button and possibly filter/sort buttons  
    var listMenu = (
      <div>
        <div className="ui button"> map</div> 
        <div className="ui input">
          <input type="text" placeholder="Search..."> </input>
        </div>
      </div>
    );

    return (   
      <div className="myOutlets container">
        <h1>Your Outlets:</h1><br></br>
        {tableHead}
      </div>
    );
  }

});

module.exports = myOutlets;
