/* {} is es-lint workaround, as max params is 4... */
const Sorting = (
    sortingChoices,
    { objectToSet, prevObject },
    getSortingValue
) => {
    const { order, key } = sortingChoices
    switch (key) {
        case 'due':
            if (order === 'asc') {
                objectToSet(
                    [...prevObject].sort(
                        (a, b) => getSortingValue(a) - getSortingValue(b)
                    )
                )
            } else if (order === 'desc') {
                objectToSet(
                    [...prevObject].sort(
                        (a, b) => getSortingValue(b) - getSortingValue(a)
                    )
                )
            }
            break
        case 'title':
            if (order === 'asc') {
                objectToSet(
                    [...prevObject].sort((a, b) =>
                        a.title.toLocaleLowerCase() >
                        b.title.toLocaleLowerCase()
                            ? 1
                            : -1
                    )
                )
            } else if (order === 'desc') {
                objectToSet(
                    [...prevObject].sort((a, b) =>
                        a.title.toLocaleLowerCase() >
                        b.title.toLocaleLowerCase()
                            ? -1
                            : 1
                    )
                )
            }
            break
    }
}

export default Sorting
