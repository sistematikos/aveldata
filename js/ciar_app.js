// SISTEMATIKOS - CONTROL VOLEY v2.6 - PROTEGIDO
(function(){
    const _w = window;
    const _d = document;

    // CONFIGURACIÓN FIREBASE (Mantén tus credenciales aquí)
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

    // --- FUNCIÓN: CARGAR LISTA PÚBLICA (index_listaciar.html) ---
    const _tB = _d.getElementById('aTB');
    if (_tB) {
        db.collection("atletas").orderBy("nombre", "asc").onSnapshot((sn) => {
            _tB.innerHTML = "";
            let c = 0;
            sn.forEach((doc) => {
                const d = doc.data();
                const r = _d.createElement('tr');
                r.className = "hover:bg-gray-50 transition-colors";
                // IMPORTANTE: Se añade la columna d.categoria (Cat.)
                r.innerHTML = `
                    <td class="px-4 py-3">
                        <div class="font-black text-gray-800 uppercase">${d.nombre}</div>
                        <div class="text-[9px] text-gray-400 font-bold">C.I: ${d.cedula}</div>
                    </td>
                    <td class="px-4 py-3 text-center font-black text-blue-600">${d.categoria || 'S/C'}</td>
                    <td class="px-4 py-3 font-bold text-gray-600 uppercase">${d.club}</td>
                    <td class="px-4 py-3 text-center">
                        <span class="px-2 py-1 rounded-full text-[8px] font-black ${d.estatus === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${d.estatus}
                        </span>
                    </td>
                `;
                _tB.appendChild(r);
                c++;
            });
            const _cnt = _d.getElementById('contador');
            if(_cnt) _cnt.innerText = `TOTAL: ${c} ATLETAS`;
        });
    }

    // --- FUNCIÓN: GUARDAR / ACTUALIZAR (index_ciar.html) ---
    const _f = _d.getElementById('aFo');
    if (_f) {
        _f.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = _d.getElementById('aId').value;
            const btn = _d.getElementById('btnGuardar');
            btn.disabled = true;
            btn.innerText = "PROCESANDO...";

            const data = {
                nombre: _d.getElementById('nom').value.toUpperCase(),
                cedula: _d.getElementById('ced.').value,
                estatus: _d.getElementById('est').value,
                club: _d.getElementById('clu').value.toUpperCase(),
                fechaNac: _d.getElementById('fNa').value,
                categoria: _d.getElementById('cat').value // <-- ESTA ES LA LÍNEA QUE ENVÍA LA CATEGORÍA
            };

            try {
                if (id) {
                    await db.collection("atletas").doc(id).update(data);
                } else {
                    await db.collection("atletas").add(data);
                }
                alert("✅ DATOS GUARDADOS EN DATA CIAR");
                _w.location.href = "index_mdfciar.html";
            } catch (err) {
                alert("❌ ERROR AL GUARDAR");
                btn.disabled = false;
                btn.innerText = "GUARDAR ATLETA";
            }
        });
    }

    // --- FUNCIÓN: FILTRAR BUSQUEDA ---
    _w.filtrar = () => {
        const bus = _d.getElementById('busNom').value.toUpperCase();
        const filas = _d.querySelectorAll('tbody tr');
        filas.forEach(f => {
            const txt = f.innerText.toUpperCase();
            f.style.display = txt.includes(bus) ? '' : 'none';
        });
    };

    // --- PROTECCIÓN SISTEMATIKOS ---
    _d.addEventListener('contextmenu', e => e.preventDefault());
    _d.onkeydown = (e) => {
        if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || (e.ctrlKey && e.keyCode == 85)) return false;
    };
})();
