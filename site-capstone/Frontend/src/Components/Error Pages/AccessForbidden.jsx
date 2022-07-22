export default function AccessForbidden({message}){
    return(
    <div className="access-forbidden text-center">
        <h1>Access Forbidden</h1>
        <h3>{message}</h3>
    </div>
    )   
}