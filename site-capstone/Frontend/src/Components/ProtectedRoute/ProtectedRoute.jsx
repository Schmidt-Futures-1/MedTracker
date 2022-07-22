import Login from "../Login/Login"

export default function ({element, user, setUser}) {

    if (!user?.email) return <Login user={user} setUser={setUser}/>

    return <>{element}</>
}