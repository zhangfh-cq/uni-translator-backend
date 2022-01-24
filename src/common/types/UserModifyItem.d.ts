type UserModifyItem = {
    username: {
        isModify: boolean,
        newUsername: string
    },
    password: {
        isModify: boolean,
        oldPassword: string,
        newPassword: string
    },
    email: {
        isModify: boolean,
        newEmail: string
    },
    autograph: {
        isModify: boolean,
        newAutograph: string
    }
}

export default UserModifyItem;