var React = require('react');
var outletStore = require('../stores/outletStore');
var ConnectusDispatcher = require('../dispatcher/ConnectusDispatcher');
var OutletListConstants = require('../constants/OutletListConstants')
var ReactAddons = require('react/addons');
var Link = require('react-router').Link;
var Router = require('react-router'); //need this for redirection
var outletServices = require('../services/outletServices.js');
var moment = require('moment');
var $ = require('jquery');
var FooterCheck = require('./footerCheck');

var buyerReservations = React.createClass({

  getInitialState: function(){
    return {
      data: []
    //   realtime: {
    //     totalKwh: 0,
    //     watts: 0,
    //     clientData: {
    //       outlet: {
    //         priceEnergy: 0,
    //         priceHourly: 0
    //       }
    //     }
    //   }
    }
  },

  mixins: [Router.Navigation], //makes the router navigation information available for use (need this for redirection)

  // reserveOutlet: function(id){
  //   ConnectusDispatcher.dispatch({
  //       action: 'CLICK_OUTLET',
  //       id: id
  //   });
  // },

  componentDidMount: function() {
    var that = this;

    FooterCheck.checker();

    console.log(moment("2015-07-30 00:30", "YYYY-MM-DD HH:mm") > moment());
    outletStore.getBuyerReservations().then(function(transactionsData){
      that.setState({data: transactionsData});
    });
  },

  footerCheck: function() {
    console.log('checking footer');
    if ( ( $('body').height() ) < window.innerHeight - 160 ) {
      console.log('body height is less than window inner height')
      $('.footer-banner').css('top', (window.innerHeight) - 160);
    }
  },

  setCurrentTransaction: function(transaction){
    console.log(transaction)
    var that =this;
    outletStore.setCurrentTransaction({id: transaction.id, currentStatus: true, paid: false}).then(function(transaction){
      outletServices.turnOutletOff(transaction); //connects with powerServer
      that.transitionTo('paymentsPage');
      return transaction;
    });
  },

  turnOn: function(transaction) {
    outletServices.turnOutletOn(transaction)
    var transactionId = transaction.id+'';
    var targetClass = '.'+transactionId;
    $(targetClass).find('.turnOn').hide();

    var socket = io.connect(OutletListConstants.BASE_URL);
    socket.on(transactionId, function (data) {
      console.log("got energy!", data);
      // convert and display power data
      // var pricePerKwh = data.totalKwh * data.clientData.outlet.priceEnergy;
      // var hourlyPrice = data.clientData.outlet.priceHourly/(60*60)*10;
      var totalCost = (data.totalCost).toFixed(3);
      var avgWatts = (data.avgWatts).toFixed(0);
      var targetClass = '.'+transactionId;
      $(targetClass).find('.totalKwh').text(data.totalKwh.toFixed(3));
      $(targetClass).find('.total').text(totalCost);
      $(targetClass).find('.watts').text(avgWatts);
    });
  },

  //function to turn off powerServer found in setCurrent Transaction
  render: function() {
    var power = '';
    // is the user authenticated?
    if(!document.cookie){
      this.transitionTo('login');
      return <h1></h1>;
    }

    var that = this;
    console.log('STATE:  ', this.state)
    // Math.round(that.state.realtime.totalKwh*1000)/1000 
    if (this.state.data.length !==0) {
      console.log(this.state.data);
      var transactionRows = this.state.data.map(function(transaction) {
      
        return (
          <tr key={ transaction.id } className={  moment(transaction.endTime.date + " " + transaction.endTime.slot.time,"YYYY-MM-DD HH:mm") < moment() ?  "oldReservation regTransRow" : "regTransRow"}>
            <td className='regTrans'>
              Start: { transaction.startTime.date} - { transaction.startTime.slot.time }
              <br />
              End: { transaction.endTime.date } - { transaction.endTime.slot.time } 
            </td>
            <td className='regTrans'>
              { transaction.outlet.name } 
            </td>
            <td className='regTrans'>
              { transaction.seller.fullname }
            </td>
            <td className='regTrans'>
              { transaction.outlet.voltage }
            </td>
            <td className='regTrans'>
              ${ transaction.outlet.priceHourly }/hr
              <br />
              ${ transaction.outlet.priceEnergy }/kWh
            </td>
            <td className='regTrans'>
            { transaction.outlet.description }
            </td>
            <td className='regTrans'>
              <div className={moment(transaction.endTime.date + " " + transaction.endTime.slot.time,"YYYY-MM-DD HH:mm") < moment() || moment(transaction.startTime.date + " " + transaction.startTime.slot.time,"YYYY-MM-DD HH:mm") > moment()? ' hidden' + ' ' : ''}>
                <div className= "btn turnOn" onClick={that.turnOn.bind(that, transaction)}>ON</div>
                <div className="btn turnOff" onClick={that.setCurrentTransaction.bind(that, transaction)}>OFF</div>
              </div>
            </td>
            <td className={transaction.id}>
              <div className="powerData">
                <p><span>Total kWh </span><span className="totalKwh"></span></p>
                <p><span>Total $ </span><span className="total"></span></p>
                <p><span>Watts </span><span className="watts"></span></p>
              </div>
            </td>
          </tr>
        )
      });
      console.log(transactionRows);
    }

    // for active transactions ------
    // is there active transactions for this user?
      // set active transactions html element to that data

      return (
        <div className="outletsList container">
          <table className="ui selectable celled padded table transaction-rows">
            <thead>
              <tr>
                <th>Reservation Info</th>
                <th className="">Outlet Name</th>
                <th>Seller</th>
                <th>Voltage</th>
                <th>Price</th>
                <th>Description</th>
                <th>Controller</th>
                <th>Realtime Data</th>
              </tr>
            </thead>
            <tbody>
              { transactionRows }
            </tbody>            
          </table>
        </div>
      )
    // });  from the promise closing
  },

  _onChange: function() {
    this.setState(this.getInitialState());
  }

});

// var ActiveTransaction = React.createClass({

//   getInitialState: function(){
//     return {
//       data:  {
//         totalKwh: 0,
//         watts: 0,
//         clientData: {
//           outlet: {
//             priceEnergy: 0,
//             priceHourly: 0
//           }
//         }
//       }
//     };
//   },

//   componentDidMount: function(){
//     this.updateData();
//   },

//   updateData: function() {
//     // var context = this.props.context;
//     // var transactionId = this.props.transactionId;
//     // var socket = io.connect(OutletListConstants.BASE_URL);
//     // socket.on(transactionId, function (data) {
//     //   console.log("got energy!", data);
//     //   context.setState({data: data})
//     // });

    
//   },

//   // returns power usage data
//   render: function() {
//     var transactionId = this.props.transaction.id + '';
//     return (
      
//     )
//   }
// })


module.exports = buyerReservations;
