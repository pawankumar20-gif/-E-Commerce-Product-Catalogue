import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm mb-6 text-gray-600">
      <Link to="/" className="hover:text-primary transition">Home</Link>
      {pathnames.map((name, index) => (
        <React.Fragment key={index}>
          <FiChevronRight size={16} />
          <Link
            to={`/${pathnames.slice(0, index + 1).join('/')}`}
            className="hover:text-primary transition capitalize"
          >
            {name.replace('-', ' ')}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
