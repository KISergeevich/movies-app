import { Tabs } from 'antd'
import { Component } from 'react'
import './header.css'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

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

  // eslint-disable-next-line react/destructuring-assignment
  debouncedSearch = debounce((search) => this.props.onSearch(search), 1000, {
    maxWait: 500,
  })

  searchChanged(event) {
    this.debouncedSearch(event.target.value)
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
