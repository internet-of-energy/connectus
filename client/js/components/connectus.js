var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Auth = require('../services/authServices.js');
var Link = require('react-router').Link;
var mobile = require('./mobilecheck');
var FooterCheck = require('./footerCheck');

//Navigation bar and base page - renders conditionally based on whether or not a user is logged in

var Connectus = React.createClass({
  logout: function(){
    Auth.logout();
  },

  componentDidMount: function() {
    // resizing the screen renders mobile or full menu
    var that = this; 
    var isMobile = mobile();
    window.onresize = function() {
      FooterCheck.checker();
      that.forceUpdate();
    };
  },

  render: function() {
    // check if the screen is mobile sized
    var isMobile = mobile();
    var routeHandler = (
      <div>
        <RouteHandler />
      </div>
    );

    //default view is the user NOT logged in
    var pageHtml = (
      <div className="check-footer" className="topNavBar">
        <div className="logo-image"></div>
        <span className="logo">
          <Link to="about">Connect.us</Link>
        </span>
      </div>
    );

    if(isMobile){
      var footerHtml = (
        <div className="container-fluid footer-banner">
            <div className='footer-1'>
              <h3>Connect.us Team</h3>
              <h4>Sean Connor, Valerie Liang,</h4>
              <h4>Dianna Faulk, Jammie Mountz</h4>
            </div>
            <a href="https://github.com/kinectus/connectus"><div className='footer-2 octocat'></div></a>
        </div>
      );
    } else {
      var footerHtml = (
        <div className="container-fluid footer-banner">
          <div className='row footer'>
            <div className='col-md-4'>
              <h4>Connect.us Team</h4>
              <h5>Sean Connor, Valerie Liang,</h5>
              <h5>Dianna Faulk, Jammie Mountz</h5>
            </div>
            <div className="col-md-4">
              <a href="https://github.com/kinectus/connectus">
                <div className='octocat'></div>
                <h4 className="light center">Find Connect.us on Github</h4>
              </a>
            </div>
            <div className='col-md-4'></div>
          </div>
        </div>
      );
    }

    //reset the html that will be shown if the user is logged in(cookie present)
    if(document.cookie){

      if(isMobile){
        console.log('mobile')

        pageHtml = (
          <div className="topNavBar">
            <div className="mobile">
              <div className="logo-image"></div>
                <span className="logo">
                  <Link to="about">Connect.us</Link>
                </span>
            </div>
            <div className="mobile">
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Menu<span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    <li className="check-footer" role="presentation"><Link to="outletsList">Outlets</Link></li>
                    <li className="check-footer" role="presentation"><Link to="addOutlet">Add Outlet</Link></li>
                    <li className="check-footer" role="presentation"><Link to="buyerReservations">My Reservations</Link></li>
                    <li className="check-footer" role="presentation"><Link to="manageOutlets">Manage Outlets</Link></li>
                    <li role="separator" className="divider"></li>
                    <li className="check-footer" role="presentation"><a className="logout" onClick={this.logout}>Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div> 
      )

      // non-mobile rendering
      } else {
        // <div className="logo-image"></div>
        //             <span className="logo">
        //               <Link to="about">Connect.us</Link>
        //             </span>
        //             <ul className="nav nav-pills pull-right">
        //               <li className="check-footer" role="presentation"><Link to="outletsList">Outlets</Link></li>
        //               <li className="check-footer" role="presentation"><Link to="addOutlet">Add Outlet</Link></li>
        //               <li className="check-footer" role="presentation"><Link to="buyerReservations">My Reservations</Link></li>
        //               <li className="check-footer" role="presentation"><Link to="manageOutlets">Manage Outlets</Link></li>
        //               <li className="check-footer" role="presentation"><a className="logout" onClick={this.logout}>Logout</a></li>
        //             </ul>
        pageHtml = (
          <div className="navbar navbar-inverse topNavBar" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <div className="logo-image"></div>
                <span className="logo">
                    <Link to="about">Connect.us</Link>
                </span>
              </div>
              <div className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li className="check-footer" role="presentation"><Link to="outletsList">Outlets</Link></li>
                  <li className="check-footer" role="presentation"><Link to="addOutlet">Add Outlet</Link></li>
                  <li className="check-footer" role="presentation"><Link to="buyerReservations">My Reservations</Link></li>
                  <li className="check-footer" role="presentation"><Link to="manageOutlets">Manage Outlets</Link></li>
                  <li className="check-footer" role="presentation"><a className="logout" onClick={this.logout}>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
          );
      } 
    }

    //actual rendering happens here - logic to decide what {pageHtml} is happens above
    return (
    <div className="container-fluid">
      {pageHtml}
      {routeHandler}
      {footerHtml}
    </div>
    );
  }
});

module.exports = Connectus;
