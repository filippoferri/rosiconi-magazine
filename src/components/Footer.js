import React from 'react'

const Footer = class extends React.Component {
  render() {
    return (
      <footer id="colophon" className="footer has-background-black has-text-white-ter">
        <div className="container">
          <div className="columns">
            <div className="column">Online da Settembre 2019</div>
            <div className="column has-text-right">Contact | Privacy Policy</div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
