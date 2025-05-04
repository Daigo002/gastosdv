// Variables globales
let gastoDiego = 0;
let gastoValery = 0;
let deudaDiego = 0;
let deudaValery = 0;
let ingresoDiego = 0;
let ingresoValery = 0;
let metaRefrigeradora = 0;
let metaLavadora = 0;
let metaPowerbank = 0;
let metaLicuadora = 0;
let metaCuartoPiso = 0;

const preciosMetas = {
    refrigeradora: 1500,
    lavadora: 1500,
    powerbank: 210,
    licuadora: 429,
    cuartoPiso: 10000 // Estimación
};

// Splash animación
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('fade-out');
    }, 1500);
    mostrarTab('gastos'); // Mostrar gastos por defecto
});

// Función Modo Oscuro
function toggleModoOscuro() {
    document.body.classList.toggle('dark-mode');
}

// Funciones de actualización
function actualizarPantalla() {
    document.getElementById('gasto-diego').textContent = gastoDiego.toFixed(2);
    document.getElementById('gasto-valery').textContent = gastoValery.toFixed(2);
    document.getElementById('deuda-diego').textContent = deudaDiego.toFixed(2);
    document.getElementById('deuda-valery').textContent = deudaValery.toFixed(2);
    document.getElementById('ingreso-diego').textContent = ingresoDiego.toFixed(2);
    document.getElementById('ingreso-valery').textContent = ingresoValery.toFixed(2);

    document.getElementById('meta-refrigeradora').style.width = metaRefrigeradora + '%';
    document.getElementById('meta-lavadora').style.width = metaLavadora + '%';
    document.getElementById('meta-powerbank').style.width = metaPowerbank + '%';
    document.getElementById('meta-licuadora').style.width = metaLicuadora + '%';
    document.getElementById('meta-cuarto-piso').style.width = metaCuartoPiso + '%';

    const saldoTotal = (ingresoDiego + ingresoValery) - (gastoDiego + gastoValery);
    const saldoElemento = document.getElementById('saldo-disponible');
    saldoElemento.textContent = saldoTotal.toFixed(2);
    saldoElemento.style.color = saldoTotal >= 0 ? '#4caf50' : '#f44336';

    actualizarImagenesMetas();
}

function actualizarImagenesMetas() {
    const actualizarImagen = (meta, porcentaje) => {
        const img = document.getElementById('img-' + meta);
        if (!img) return;

        if (porcentaje <= 30) img.style.filter = 'grayscale(80%)';
        else if (porcentaje <= 70) img.style.filter = 'grayscale(30%)';
        else img.style.filter = 'grayscale(0%)';
    };

    actualizarImagen('refrigeradora', metaRefrigeradora);
    actualizarImagen('lavadora', metaLavadora);
    actualizarImagen('powerbank', metaPowerbank);
    actualizarImagen('licuadora', metaLicuadora);
    actualizarImagen('cuarto-piso', metaCuartoPiso);
}

// Funciones para agregar registros

async function agregarGasto() {
    const persona = prompt('¿Quién gastó? (Diego/Valery)').toLowerCase();
    const monto = parseFloat(prompt('¿Cuánto gastó?'));
    const categoria = prompt('¿Categoría? (comida, pasaje, ropa, etc.)').toLowerCase();
    const fecha = new Date().toISOString();

    try {
        await db.collection('gastos').add({ persona, monto, categoria, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Gasto registrado!',
            text: 'Tu gasto fue añadido correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar gasto:', error);
    }
}

async function agregarDeuda() {
    const persona = prompt('¿Quién debe añadir a la alcancía? (Diego/Valery)').toLowerCase();
    const monto = parseFloat(prompt('¿Cuánto debe añadir?'));
    const fecha = new Date().toISOString();

    try {
        await db.collection('deudas').add({ persona, monto, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Deuda registrada!',
            text: 'Aporte a la alcancía añadido correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar deuda:', error);
    }
}

async function aportarMeta() {
    const meta = prompt('¿A qué meta quieres aportar? (refrigeradora/lavadora/powerbank/licuadora/cuartoPiso)').toLowerCase();
    const monto = parseFloat(prompt('¿Cuánto dinero quieres aportar?'));
    const fecha = new Date().toISOString();

    if (!preciosMetas[meta]) {
        Swal.fire({
            icon: 'error',
            title: 'Meta inválida',
            text: 'La meta seleccionada no es válida.',
        });
        return;
    }

    try {
        await db.collection('aportesMetas').add({ meta, monto, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Aporte registrado!',
            text: 'Tu aporte a la meta fue añadido correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar aporte:', error);
    }
}

// Funciones de ingresos

async function registrarIngresoDiego() {
    const monto = parseFloat(prompt('¿Cuánto ingreso registras para Diego?'));
    const fecha = new Date().toISOString();

    try {
        await db.collection('ingresos').add({ persona: 'diego', monto, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Ingreso registrado!',
            text: 'Ingreso de Diego añadido correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar ingreso:', error);
    }
}

async function registrarIngresoValery() {
    const monto = parseFloat(prompt('¿Cuánto ingreso registras para Valery?'));
    const fecha = new Date().toISOString();

    try {
        await db.collection('ingresos').add({ persona: 'valery', monto, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Ingreso registrado!',
            text: 'Ingreso de Valery añadido correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar ingreso:', error);
    }
}

async function registrarFinDeMes() {
    const fecha = new Date().toISOString();

    try {
        await db.collection('deudas').add({ persona: 'diego', monto: 30, fecha });
        await db.collection('deudas').add({ persona: 'valery', monto: 30, fecha });
        Swal.fire({
            icon: 'success',
            title: '¡Fin de mes!',
            text: '30 soles añadidos automáticamente a la alcancía de ambos.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Error al registrar fin de mes:', error);
    }
}

// Listeners Firebase (actualización en tiempo real)

db.collection('gastos').onSnapshot(snapshot => {
    gastoDiego = 0;
    gastoValery = 0;
    const tbody = document.querySelector('#tabla-gastos tbody');
    tbody.innerHTML = '';

    snapshot.forEach(doc => {
        const gasto = doc.data();
        if (gasto.persona === 'diego') gastoDiego += gasto.monto;
        if (gasto.persona === 'valery') gastoValery += gasto.monto;

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${gasto.persona}</td><td>${gasto.monto.toFixed(2)}</td><td>${gasto.categoria}</td><td>${new Date(gasto.fecha).toLocaleDateString()}</td>`;
        tbody.appendChild(tr);
    });
    actualizarPantalla();
});

db.collection('deudas').onSnapshot(snapshot => {
    deudaDiego = 0;
    deudaValery = 0;
    const tbody = document.querySelector('#tabla-deudas tbody');
    tbody.innerHTML = '';

    snapshot.forEach(doc => {
        const deuda = doc.data();
        if (deuda.persona === 'diego') deudaDiego += deuda.monto;
        if (deuda.persona === 'valery') deudaValery += deuda.monto;

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${deuda.persona}</td><td>${deuda.monto.toFixed(2)}</td><td>${new Date(deuda.fecha).toLocaleDateString()}</td>`;
        tbody.appendChild(tr);
    });
    actualizarPantalla();
});

db.collection('ingresos').onSnapshot(snapshot => {
    ingresoDiego = 0;
    ingresoValery = 0;

    snapshot.forEach(doc => {
        const ingreso = doc.data();
        if (ingreso.persona === 'diego') ingresoDiego += ingreso.monto;
        if (ingreso.persona === 'valery') ingresoValery += ingreso.monto;
    });
    actualizarPantalla();
});

db.collection('aportesMetas').onSnapshot(snapshot => {
    let total = {
        refrigeradora: 0,
        lavadora: 0,
        powerbank: 0,
        licuadora: 0,
        cuartoPiso: 0
    };

    snapshot.forEach(doc => {
        const aporte = doc.data();
        if (total[aporte.meta] !== undefined) total[aporte.meta] += aporte.monto;
    });

    metaRefrigeradora = Math.min((total.refrigeradora / preciosMetas.refrigeradora) * 100, 100);
    metaLavadora = Math.min((total.lavadora / preciosMetas.lavadora) * 100, 100);
    metaPowerbank = Math.min((total.powerbank / preciosMetas.powerbank) * 100, 100);
    metaLicuadora = Math.min((total.licuadora / preciosMetas.licuadora) * 100, 100);
    metaCuartoPiso = Math.min((total.cuartoPiso / preciosMetas.cuartoPiso) * 100, 100);

    actualizarPantalla();
});

// Función para cambiar pestañas
function mostrarTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
}
