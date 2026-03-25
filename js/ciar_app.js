(function(){
    const _w = window;
    const _d = document;

    // --- REEMPLAZA ESTO CON TUS CREDENCIALES EXACTAS ---
    const firebaseConfig = {
        apiKey: "TU_API_KEY",
        authDomain: "tu-proyecto.firebaseapp.com",
        projectId: "tu-proyecto",
        storageBucket: "tu-proyecto.appspot.com",
        messagingSenderId: "0000000000",
        appId: "1:0000000000:web:000000"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // --- RENDERIZADO DE TABLA (index_listaciar.html e index_mdfciar.html) ---
    const tB = _d.getElementById('aTB'); // Tabla Pública
    const tA = _d.getElementById('aTB_Admin'); // Tabla Admin

    if (tB || tA) {
        db.collection("atletas").orderBy("nombre", "asc").onSnapshot((sn) => {
            if (tB) tB.innerHTML = "";
            if (tA) tA.innerHTML = "";
            let c = 0;

            sn.forEach((doc) => {
                const d = doc.data();
                const id = doc.id;
                const cat = d.categoria || "S/C";
                const estClass = d.estatus === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

                // Si estamos en la LISTA PÚBLICA
                if (tB) {
                    const r = _d.createElement('tr');
                    r.innerHTML = `
                        <td class="px-4 py-3 border-b border-gray-50">
                            <div class="font-black text-gray-800 uppercase">${d.nombre}</div>
                            <div class="text-[9px] text-gray-400 font-bold">C.I: ${d.cedula}</div>
                        </td>
                        <td class="px-4 py-3 border-b border-gray-50 text-center font-black text-blue-600">${cat}</td>
                        <td class="px-4 py-3 border-b border-gray-50 font-bold text-gray-600 uppercase text-[10px]">${d.club}</td>
                        <td class="px-4 py-3 border-b border-gray-50 text-center">
                            <span class="px-2 py-1 rounded-full text-[8px] font-black ${estClass}">${d.estatus}</span>
                        </td>`;
                    tB.appendChild(r);
                }

                // Si estamos en el PANEL ADMIN
                if (tA) {
                    const r = _d.createElement('tr');
                    r.innerHTML = `
                        <td class="px-4 py-3 border-b border-gray-50 uppercase font-bold">${d.nombre}<br><span class="text-[9px] text-gray-400">${d.cedula}</span></td>
                        <td class="px-4 py-3 border-b border-gray-50 text-center"><span class="px-2 py-1 rounded-full text-[8px] font-black ${estClass}">${d.estatus}</span></td>
                        <td class="px-4 py-3 border-b border-gray-50 text-center">
                            <button onclick="window.e_A('${id}')" class="text-blue-600 font-black mr-2">EDITAR</button>
                            <button onclick="window.b_A('${id}')" class="text-red-600 font-black">BORRAR</button>
                        </td>`;
                    tA.appendChild(r);
                }
                c++;
            });
            const cnt = _d.getElementById('contador');
            if(cnt) cnt.innerText = `TOTAL: ${c} ATLETAS`;
        });
    }

    // --- GUARDAR ATLETA ---
    const f = _d.getElementById('aFo');
    if (f) {
        f.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = _d.getElementById('aId').value;
            const btn = _d.getElementById('btnGuardar');
            btn.disabled = true;

            const data = {
                nombre: _d.getElementById('nom').value.toUpperCase(),
                cedula: _d.getElementById('ced').value, // Verifica que el ID sea 'ced' sin el punto
                estatus: _d.getElementById('est').value,
                club: _d.getElementById('clu').value.toUpperCase(),
                fechaNac: _d.getElementById('fNa').value,
                categoria: _d.getElementById('cat').value
            };

            try {
                if (id) { await db.collection("atletas").doc(id).update(data); }
                else { await db.collection("atletas").add(data); }
                _w.location.href = "index_mdfciar.html";
            } catch (err) { alert("Error"); btn.disabled = false; }
        });
    }

    // --- FUNCIONES GLOBALES ---
    _w.filtrar = () => {
        const b = _d.getElementById('busNom').value.toUpperCase();
        _d.querySelectorAll('tbody tr').forEach(r => r.style.display = r.innerText.toUpperCase().includes(b) ? '' : 'none');
    };

    _w.e_A = async (id) => {
        const doc = await db.collection("atletas").doc(id).get();
        const d = doc.data();
        sessionStorage.setItem('edit_id', id);
        sessionStorage.setItem('edit_data', JSON.stringify(d));
        _w.location.href = "index_ciar.html";
    };

    // Al cargar el formulario de edición
    if (_d.getElementById('aFo') && sessionStorage.getItem('edit_id')) {
        const id = sessionStorage.getItem('edit_id');
        const d = JSON.parse(sessionStorage.getItem('edit_data'));
        _d.getElementById('aId').value = id;
        _d.getElementById('nom').value = d.nombre;
        _d.getElementById('ced').value = d.cedula;
        _d.getElementById('est').value = d.estatus;
        _d.getElementById('clu').value = d.club;
        _d.getElementById('fNa').value = d.fechaNac;
        _d.getElementById('cat').value = d.categoria || "";
        sessionStorage.removeItem('edit_id');
        sessionStorage.removeItem('edit_data');
    }

    // PROTECCIÓN
    _d.addEventListener('contextmenu', e => e.preventDefault());
    _d.onkeydown = (e) => {
        if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || (e.ctrlKey && e.keyCode == 85)) return false;
    };
})();
