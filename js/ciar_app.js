/* SISTEMATIKOS - FRANK HERNANDEZ 
   PROYECTO: DATA CIAR 2026 
   CONTROL DE VOLEY PROFESIONAL - COLUMNA CATEGORÍA ACTIVADA
*/

// 1. CONFIGURACIÓN DE FIREBASE (Tus credenciales originales)
const firebaseConfig = {
    apiKey: "AIzaSyCKJsap2fngZqlbtzP1twrz-1qzF-6Mpjk",
    authDomain: "dataciar.firebaseapp.com",
    projectId: "dataciar",
    storageBucket: "dataciar.firebasestorage.app",
    messagingSenderId: "304365115097",
    appId: "1:304365115097:web:3339775f70ccf02e8a50c8"
};

if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}
const db = firebase.firestore();
const d = document;

// 2. CÁLCULO AUTOMÁTICO DE CATEGORÍAS (index_ciar.html)
window.calcularCategoria = (fechaVal) => {
    if (!fechaVal) return;
    const anio = new Date(fechaVal).getUTCFullYear();
    const inputCat = d.getElementById('cat');
    if(!inputCat) return;

    let cat = "MAYOR / MASTER";
    if (anio >= 2017 && anio <= 2018) cat = "U9";
    else if (anio >= 2015 && anio <= 2016) cat = "U11";
    else if (anio >= 2013 && anio <= 2014) cat = "U13";
    else if (anio >= 2011 && anio <= 2012) cat = "U15";
    else if (anio >= 2009 && anio <= 2010) cat = "U17";
    
    inputCat.value = cat;
};

// 3. REGISTRO Y ACTUALIZACIÓN (index_ciar.html)
const f = d.getElementById('aFo');
if (f) {
    const edicion = JSON.parse(localStorage.getItem('edit_ciar'));
    if (edicion) {
        d.getElementById('aId').value = edicion.id;
        d.getElementById('nom').value = edicion.nombre;
        d.getElementById('ced').value = edicion.cedula;
        d.getElementById('clu').value = edicion.club;
        d.getElementById('est').value = edicion.estatus;
        d.getElementById('fNa').value = edicion.fechaNacimiento;
        d.getElementById('cat').value = edicion.categoria || "";
        d.getElementById('btnGuardar').textContent = "ACTUALIZAR REGISTRO";
        localStorage.removeItem('edit_ciar');
    }

    f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = d.getElementById('aId').value;
        const datos = {
            nombre: d.getElementById('nom').value.trim().toUpperCase(),
            cedula: d.getElementById('ced').value,
            club: d.getElementById('clu').value.trim().toUpperCase(),
            estatus: d.getElementById('est').value,
            fechaNacimiento: d.getElementById('fNa').value,
            categoria: d.getElementById('cat').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            if (id) {
                await db.collection("registros").doc(id).update(datos);
                alert("✅ ATLETA ACTUALIZADO");
            } else {
                await db.collection("registros").add({
                    ...datos, 
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert("✅ REGISTRO CREADO");
            }
            window.location.href = "index_mdfciar.html";
        } catch (err) { alert("Error: " + err.message); }
    });
}

// 4. LÓGICA DE TABLA PÚBLICA (index_listaciar.html) - CON COLUMNA CATEGORÍA
const tPub = d.getElementById('aTB');
if (tPub) {
    db.collection("registros").orderBy("nombre", "asc").onSnapshot((snap) => {
        tPub.innerHTML = "";
        snap.forEach(doc => {
            const r = doc.data();
            const estCol = r.estatus === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
            
            tPub.insertAdjacentHTML('beforeend', `
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition text-[11px]">
                    <td class="px-4 py-3 uppercase">
                        <div class="font-black text-blue-600 leading-tight">${r.nombre}</div>
                        <div class="text-[9px] text-gray-400 font-bold">C.I: ${r.cedula || 'S/N'}</div>
                    </td>
                    <td class="px-4 py-3 text-center font-black text-gray-700">${r.categoria || 'S/C'}</td>
                    <td class="px-4 py-3 text-gray-500 uppercase font-bold text-[9px]">${r.club}</td>
                    <td class="px-4 py-3 text-center">
                        <span class="${estCol} px-2 py-0.5 rounded-full text-[8px] font-black uppercase">${r.estatus}</span>
                    </td>
                </tr>
            `);
        });
        const cont = d.getElementById('contador');
        if(cont) cont.textContent = snap.size + " ATLETAS REGISTRADOS";
    });
}

// 5. LÓGICA DE TABLA ADMINISTRATIVA (index_mdfciar.html)
const tAdm = d.getElementById('aTB_Admin');
if (tAdm) {
    db.collection("registros").orderBy("nombre", "asc").onSnapshot((snap) => {
        tAdm.innerHTML = "";
        snap.forEach(doc => {
            const r = doc.data();
            const estCol = r.estatus === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
            
            tAdm.insertAdjacentHTML('beforeend', `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td class="px-4 py-3 uppercase">
                        <div class="font-black text-gray-800 text-xs leading-tight">${r.nombre}</div>
                        <div class="text-[9px] text-blue-500 font-bold">C.I: ${r.cedula || 'S/N'} | ${r.categoria || 'S/C'}</div>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <span class="${estCol} px-2 py-0.5 rounded-full text-[8px] font-black uppercase">${r.estatus}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <div class="flex justify-center gap-1">
                            <button onclick='window.editar("${doc.id}", ${JSON.stringify(r).replace(/'/g, "&apos;")})' class="bg-blue-600 text-white px-2 py-1 rounded-lg text-[8px] font-black">MOD</button>
                            <button onclick="window.eliminar('${doc.id}')" class="bg-red-600 text-white px-2 py-1 rounded-lg text-[8px] font-black">DEL</button>
                        </div>
                    </td>
                </tr>
            `);
        });
    });
}

// 6. FUNCIONES GLOBALES
window.editar = (id, data) => {
    localStorage.setItem('edit_ciar', JSON.stringify({id, ...data}));
    window.location.href = "index_ciar.html";
};

window.eliminar = async (id) => {
    if(confirm("⚠️ ¿ELIMINAR ESTE ATLETA?")) {
        try { await db.collection("registros").doc(id).delete(); } catch (err) { alert("Error"); }
    }
};

window.filtrar = () => {
    const val = d.getElementById('busNom').value.toUpperCase();
    d.querySelectorAll('tbody tr').forEach(tr => {
        tr.style.display = tr.innerText.toUpperCase().includes(val) ? "" : "none";
    });
};

// 7. PROTECCIÓN SISTEMATIKOS (F12 Bloqueado)
d.addEventListener('contextmenu', e => e.preventDefault());
d.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};
