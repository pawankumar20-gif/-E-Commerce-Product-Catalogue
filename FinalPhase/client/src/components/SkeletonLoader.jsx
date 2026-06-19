import React from 'react'

const SkeletonLoader = ({ count = 12, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="glass p-4 rounded-xl">
            <div className="skeleton w-full h-40 mb-3 rounded-lg" />
            <div className="skeleton w-3/4 h-4 mb-2" />
            <div className="skeleton w-full h-3 mb-4" />
            <div className="skeleton w-1/2 h-4" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="glass p-4 rounded-xl flex gap-4">
            <div className="skeleton w-24 h-24 rounded" />
            <div className="flex-1">
              <div className="skeleton w-3/4 h-4 mb-2" />
              <div className="skeleton w-full h-3 mb-2" />
              <div className="skeleton w-1/2 h-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default SkeletonLoader
