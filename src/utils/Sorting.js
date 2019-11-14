/* {} is es-lint workaround, as max params is 4... */
import {
    SORT_ASC,
    SORT_DESC,
    SORTING_KEY_DUE,
    SORTING_KEY_NAME,
} from '../constants/constants'

const Sorting = (
    sortingChoices,
    { objectToSet, prevObject },
    getSortingValue
) => {
    const { order, key } = sortingChoices
    switch (key) {
        case SORTING_KEY_DUE:
            if (order === SORT_ASC) {
                objectToSet(
                    [...prevObject].sort((a, b) => getSortingValue(a, b))
                )
            } else if (order === SORT_DESC) {
                objectToSet(
                    [...prevObject].sort((a, b) => getSortingValue(b, a))
                )
            }
            break
        case SORTING_KEY_NAME:
            if (order === SORT_ASC) {
                objectToSet(
                    [...prevObject].sort((a, b) =>
                        a.displayName.toLocaleLowerCase() >
                        b.displayName.toLocaleLowerCase()
                            ? 1
                            : -1
                    )
                )
            } else if (order === SORT_DESC) {
                objectToSet(
                    [...prevObject].sort((a, b) =>
                        a.displayName.toLocaleLowerCase() >
                        b.displayName.toLocaleLowerCase()
                            ? -1
                            : 1
                    )
                )
            }
            break
    }
}

export default Sorting
