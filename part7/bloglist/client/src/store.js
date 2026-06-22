import { create } from "zustand"
import blogService from "./services/blogs"
import loginService from "./services/login"
import { getUser, saveUser, removeUser } from "./services/persistentUser"

export const useNotificationStore = create((set) => ({
  notification: "",
  error: false,
  setNotification: (text, error) => {
    set(() => ({ notification: text, error }))
    setTimeout(() => set(() => ({ notification: "" })), 5000)
  },
}))

export const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs: blogs }))
    },
    create: async (blog) => {
      const res = await blogService.create(blog)
      set((state) => ({
        blogs: [...state.blogs, res],
      }))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }))
    },
    like: async (id) => {
      const blog = useBlogStore.getState().blogs.find((b) => b.id === id)
      const updated = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      })
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b.id === id ? { ...updated, user: b.user } : b,
        ),
      }))
    },
  },
}))

export const useUserStore = create((set) => ({
  user: null,
  actions: {
    initialize: async () => {
      const loggedUser = getUser()

      if (loggedUser) {
        await blogService.setToken(loggedUser.token)
        set(() => ({ user: loggedUser }))
      }
    },
    login: async ({ username, password }) => {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      set(() => ({ user: user }))

      saveUser(user)
      return user
    },
    logout: async () => {
      removeUser()
      set(() => ({ user: null }))
    },
  },
}))
export const useNotificationMessage = () =>
  useNotificationStore((state) => state.notification)

export const useNotificationError = () =>
  useNotificationStore((state) => state.error)

export const useSetNotification = () =>
  useNotificationStore((state) => state.setNotification)

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
