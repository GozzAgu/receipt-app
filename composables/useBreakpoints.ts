import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

export const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
export const largerThanSm = breakpoints.greater('sm') // only larger than sm
export const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
export const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
export const largerThanlg = breakpoints.greater('lg')
export const largerThanXl = breakpoints.greater('xl')
export const smAndLg = breakpoints.between('md', 'lg')