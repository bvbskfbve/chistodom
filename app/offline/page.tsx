'use client';
export default function Offline(){return <main className="container successPanel"><div className="successIcon">✳</div><h1>Вы временно офлайн</h1><p className="muted">Проверьте подключение к интернету и попробуйте снова. Черновик заявки сохранён на этом устройстве.</p><button className="btn primary" onClick={()=>location.reload()}>Повторить</button></main>}
