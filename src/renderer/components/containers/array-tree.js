const ArrayTree = ({ containers = [], children }) => {
  if (!containers.length === 0) {
    return (
      <>{children}</>
    )
  }

  const Component = containers.pop()

  let Next = () => (
    <Component.Container>
      {children}
    </Component.Container>
  )

  if (containers.length >= 1) {
    return (
      <ArrayTree containers={containers}>
        <Component.Container>
          {children}
        </Component.Container>
      </ArrayTree>
    )
  } else {
    return (
      <Component.Container>
        {children}
      </Component.Container>
    )
  }

  return <Next />
}

export default ArrayTree;
