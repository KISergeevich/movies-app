import React from 'react'

export default function Movie({ movie }) {
  const { title } = movie
  return <h3>{title}</h3>
}
