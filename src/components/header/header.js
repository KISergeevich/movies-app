import { Tabs } from 'antd'
import { Component } from 'react'
import './header.css'
import PropTypes from 'prop-types'

export default class Header extends Component {
  items = [
    {
      key: '1',
      label: 'Search',
      children: (
        <div className="header__box">
          <input
            className="header__search"
            placeholder="Type to search..."
            onChange={(event) => this.searchChanged(event)}
            type="text"
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: <div className="header__rated" onChange={(event) => this.searchChanged(event)} />,
    },
  ]

  searchChanged(event) {
    const { onSearch } = this.props
    onSearch(event.target.value)
  }

  render() {
    return (
      <header>
        <Tabs className="header-tabs" defaultActiveKey="1" centered items={this.items} />
      </header>
    )
  }
}

Header.propTypes = {
  onSearch: PropTypes.func,
}
Header.defaultProps = {
  onSearch: () => {},
}
