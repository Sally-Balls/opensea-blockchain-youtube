import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'rdv8uglu',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'skhdZIeUhQY66eBGCWyqCGKdC3yyoTW67s5azRxOr7ggEmH8OT67nPp7jm9aDBwf70UVt3cQHee0lxIq8HjQYqWI5oO6QzsSalwfmJCqVDC7LIOTZzl1NVcETW9xh9cg522C5gjS5nBx3zdy51Svcg9pZYcBhok99TPp1OamTU7wqBxm79e0',
  useCdn: false, 
})
