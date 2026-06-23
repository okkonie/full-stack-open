export const getUser = () => {
  const userJSON = window.localStorage.getItem("user")
  return userJSON ? JSON.parse(userJSON) : null
}

export const saveUser = async (user) => {
  await window.localStorage.setItem("user", JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem("user")
}
