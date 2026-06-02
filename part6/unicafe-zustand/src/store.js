import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  all: 0,
  actions: {
    incrementGood: () => set(state => ({
      good: state.good + 1,
      all: state.all + 1
    })),
    incrementNeutral: () => set(state => ({
      neutral: state.neutral + 1,
      all: state.all + 1
    })),
    incrementBad: () => set(state => ({
      bad: state.bad + 1,
      all: state.all + 1
    }))
  }
}))

export default useCounterStore