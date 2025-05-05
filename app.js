// Variables globales
let gastoDiego = 0;
let gastoValery = 0;
let deudaDiego = 0;
let deudaValery = 0;
let ingresoDiego = 0;
let ingresoValery = 0;
let ahorroEmergenciaDiego = 900;
let ahorroEmergenciaValery = 400;


window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('fade-out');
    }, 1500);

    mostrarTab('gastos'); // Mostrar gastos por defecto
    registrarIngresosAutomaticos(); // 👈 Agregado aquí
    verificarFinDeMes(); // 👈 Llamamos la verificación automática
    registrarGastosFijos();

});
// Función Modo Oscuro
function toggleModoOscuro() {
    document.body.classList.toggle('dark-mode');
}

// Funciones de actualización
function actualizarPantalla() {
    document.getElementById('gasto-diego').textContent = gastoDiego.toFixed(2);
    document.getElementById('gasto-valery').textContent = gastoValery.toFixed(2);

    document.getElementById('ingreso-diego').textContent = ingresoDiego.toFixed(2);
    document.getElementById('ingreso-valery').textContent = ingresoValery.toFixed(2);



    const saldoTotal = (ingresoDiego + ingresoValery) - (gastoDiego + gastoValery);
    const saldoElemento = document.getElementById('saldo-disponible');
    saldoElemento.textContent = saldoTotal.toFixed(2);
    saldoElemento.style.color = saldoTotal >= 0 ? '#4caf50' : '#f44336';

    actualizarImagenesMetas();
    actualizarAhorrosEmergencia();

}

function actualizarImagenesMetas() {
    const actualizarImagen = (meta, porcentaje) => {
        const img = document.getElementById('img-' + meta);
        if (!img) return;

        if (porcentaje <= 30) img.style.filter = 'grayscale(80%)';
        else if (porcentaje <= 70) img.style.filter = 'grayscale(30%)';
        else img.style.filter = 'grayscale(0%)';
    };
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
    const tipo = prompt('¿Tipo de deuda? (lisura / ahorro)').toLowerCase();
    const fecha = new Date().toISOString();

    if (!['lisura', 'ahorro'].includes(tipo)) {
        Swal.fire({
            icon: 'error',
            title: 'Tipo inválido',
            text: 'El tipo de deuda debe ser "lisura" o "ahorro".'
        });
        return;
    }

    let monto = 0;

    if (tipo === 'lisura') {
        const cantidadLisuras = parseInt(prompt('¿Cuántas lisuras dijo?'));
        if (isNaN(cantidadLisuras) || cantidadLisuras <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad inválida',
                text: 'Debes ingresar un número válido de lisuras.'
            });
            return;
        }
        monto = cantidadLisuras * 1; // 1 sol por lisura
    } else if (tipo === 'ahorro') {
        monto = parseFloat(prompt('¿Cuánto desea aportar al ahorro?'));
        if (isNaN(monto) || monto <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Monto inválido',
                text: 'Debes ingresar un monto válido.'
            });
            return;
        }
    }

    try {
        await db.collection('deudas').add({ persona, monto, tipo, fecha });
        Swal.fire({
            icon: 'success',
            title: '✅ Deuda registrada exitosamente!',
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
        await db.collection('deudas').add({ persona: 'diego', monto: 30, tipo: 'ahorro', fecha });
        await db.collection('deudas').add({ persona: 'valery', monto: 30, tipo: 'ahorro', fecha });

        Swal.fire({
            icon: 'success',
            title: '✅ Fin de mes registrado: 30 soles añadidos a ahorro!',
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
    let deudaDiegoLisura = 0;
    let deudaValeryLisura = 0;
    let deudaDiegoAhorro = 0;
    let deudaValeryAhorro = 0;

    const tbody = document.querySelector('#tabla-deudas tbody');
    tbody.innerHTML = '';

    snapshot.forEach(doc => {
        const deuda = doc.data();
        if (deuda.tipo === 'lisura') {
            if (deuda.persona === 'diego') deudaDiegoLisura += deuda.monto;
            if (deuda.persona === 'valery') deudaValeryLisura += deuda.monto;
        } else if (deuda.tipo === 'ahorro') {
            if (deuda.persona === 'diego') deudaDiegoAhorro += deuda.monto;
            if (deuda.persona === 'valery') deudaValeryAhorro += deuda.monto;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${deuda.persona}</td><td>${deuda.monto.toFixed(2)}</td><td>${deuda.tipo}</td><td>${new Date(deuda.fecha).toLocaleDateString()}</td>`;
        tbody.appendChild(tr);
    });

    // Actualizamos las alcancías por separado
    document.getElementById('deuda-diego-lisura').textContent = deudaDiegoLisura.toFixed(2);
    document.getElementById('deuda-valery-lisura').textContent = deudaValeryLisura.toFixed(2);
    document.getElementById('deuda-diego-ahorro').textContent = deudaDiegoAhorro.toFixed(2);
    document.getElementById('deuda-valery-ahorro').textContent = deudaValeryAhorro.toFixed(2);
});
// Listener de ingresos (FALTABA)
db.collection('ingresos').onSnapshot(snapshot => {
    ingresoDiego = 0;
    ingresoValery = 0;

    const tbody = document.querySelector('#tabla-ingresos tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }

    snapshot.forEach(doc => {
        const ingreso = doc.data();
        if (ingreso.persona === 'diego') ingresoDiego += ingreso.monto;
        if (ingreso.persona === 'valery') ingresoValery += ingreso.monto;

        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ingreso.persona}</td>
                <td>${ingreso.monto.toFixed(2)}</td>
                <td>${new Date(ingreso.fecha).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
        }
    });

    actualizarPantalla();
});



function mostrarTab(tabId) {
    if (tabId === 'emergencia') {
        Swal.fire({
            title: '🔒 Protección de Ahorro de Emergencia',
            input: 'password',
            inputLabel: 'Introduce la contraseña',
            inputPlaceholder: 'Contraseña',
            inputAttributes: {
                maxlength: 20,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Acceder',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value === '1234') { // 🔥 Aquí defines tu contraseña
                    activarTab(tabId);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Contraseña incorrecta',
                        text: 'No puedes acceder al ahorro de emergencia.'
                    });
                }
            }
        });
    } else {
        activarTab(tabId);
    }
}

function activarTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');

    // 👇 Nuevo: Si el tab es "resumen", calcular resumen
    if (tabId === 'resumen') {
        calcularResumenMensual();
    }
}
async function verificarFinDeMes() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mesActual = hoy.getMonth(); // 0 = Enero, 11 = Diciembre
    const anioActual = hoy.getFullYear();

    // Solo actuar si es día 30 o 31
    if (dia < 28) return; 

    try {
        // Revisar si ya se registró deuda de Diego este mes
        const snapshot = await db.collection('deudas')
            .where('persona', '==', 'diego')
            .orderBy('fecha', 'desc')
            .limit(1)
            .get();

        let yaRegistradoEsteMes = false;

        if (!snapshot.empty) {
            const deuda = snapshot.docs[0].data();
            const fecha = new Date(deuda.fecha);
            if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
                yaRegistradoEsteMes = true;
            }
        }

        if (!yaRegistradoEsteMes) {
            // No se ha registrado aporte este mes todavía
            await db.collection('deudas').add({ persona: 'diego', monto: 30, fecha: hoy.toISOString() });
            await db.collection('deudas').add({ persona: 'valery', monto: 30, fecha: hoy.toISOString() });

            Swal.fire({
                icon: 'success',
                title: '¡Fin de mes detectado!',
                text: '30 soles añadidos automáticamente para Diego y Valery.',
                timer: 2500,
                showConfirmButton: false
            });
        } else {
            console.log('✅ Ya se registraron los 30 soles de este mes.');
        }

    } catch (error) {
        console.error('❌ Error verificando fin de mes:', error);
    }
}
async function resetearTodo() {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esto borrará todos los registros de gastos, deudas, ingresos y metas!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, borrar todo',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            // Borrar gastos
            const gastosSnapshot = await db.collection('gastos').get();
            gastosSnapshot.forEach(doc => doc.ref.delete());

            // Borrar deudas
            const deudasSnapshot = await db.collection('deudas').get();
            deudasSnapshot.forEach(doc => doc.ref.delete());

            // Borrar ingresos
            const ingresosSnapshot = await db.collection('ingresos').get();
            ingresosSnapshot.forEach(doc => doc.ref.delete());

            // Borrar aportes a metas
            const aportesSnapshot = await db.collection('aportesMetas').get();
            aportesSnapshot.forEach(doc => doc.ref.delete());

            Swal.fire({
                icon: 'success',
                title: '¡Datos reseteados!',
                text: 'Todo fue eliminado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('❌ Error reseteando datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al resetear.',
            });
        }
    }
}
async function agregarMeta() {
    const nombre = prompt('¿Nombre de la meta? (ej: Refrigeradora)');
    const montoObjetivo = parseFloat(prompt('¿Monto objetivo en soles?'));
    const imagenURL = prompt('¿URL de la imagen para esta meta?');

    if (!nombre || isNaN(montoObjetivo) || !imagenURL) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes completar todos los campos correctamente.',
        });
        return;
    }

    try {
        await db.collection('metas').add({
            nombre: nombre,
            montoObjetivo: montoObjetivo,
            imagenURL: imagenURL,
            montoActual: 0
        });

        Swal.fire({
            icon: 'success',
            title: 'Meta creada exitosamente!',
            timer: 2000,
            showConfirmButton: false
        });

        cargarMetas(); // Actualizar la vista después de crear

    } catch (error) {
        console.error('❌ Error al crear meta:', error);
    }
}

async function cargarMetas() {
    const sectionMetas = document.querySelector('.section-metas');
    if (!sectionMetas) return; // Si no hay sección de metas, salir

    sectionMetas.innerHTML = ''; // Limpiar

    try {
        const snapshot = await db.collection('metas').get();
        snapshot.forEach(doc => {
            const meta = doc.data();
            const div = document.createElement('div');
            div.classList.add('meta');

            div.innerHTML = `
                <h3>${meta.nombre}</h3>
                <img src="${meta.imagenURL}" width="100" alt="${meta.nombre}">
                <p>Meta: S/. ${meta.montoObjetivo.toFixed(2)}</p>
                <p>Ahorro actual: S/. ${meta.montoActual.toFixed(2)}</p>
                <button onclick="eliminarMeta('${doc.id}')">🗑️ Eliminar</button>
            `;
            sectionMetas.appendChild(div);
        });
    } catch (error) {
        console.error('❌ Error cargando metas:', error);
    }
}

async function eliminarMeta(idMeta) {
    const confirmacion = await Swal.fire({
        title: '¿Eliminar meta?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            await db.collection('metas').doc(idMeta).delete();
            Swal.fire({
                icon: 'success',
                title: 'Meta eliminada correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            cargarMetas();
        } catch (error) {
            console.error('❌ Error eliminando meta:', error);
        }
    }
}
async function registrarIngresosAutomaticos() {
    const fechaHoy = new Date();
    const dia = fechaHoy.getDate();
    const diaSemana = fechaHoy.getDay(); // 0=domingo, 1=lunes, 2=martes...

    const mes = fechaHoy.getMonth() + 1;
    const anio = fechaHoy.getFullYear();
    const fechaISO = fechaHoy.toISOString();

    if (dia === 15 || dia === 30) {
        // Registrar ingreso de Diego (1500/2) = 750 soles
        const ingresoDiego = await db.collection('ingresos')
            .where('persona', '==', 'diego')
            .where('monto', '==', 750)
            .where('fecha', '>=', `${anio}-${mes.toString().padStart(2, '0')}-01`)
            .where('fecha', '<=', `${anio}-${mes.toString().padStart(2, '0')}-31`)
            .get();

        if (ingresoDiego.empty) {
            await db.collection('ingresos').add({
                persona: 'diego',
                monto: 750,
                fecha: fechaISO
            });
            console.log('✅ Ingreso automático registrado: Diego');
        }
    }

    if (dia === 15 || dia === 30) {
        // Registrar ingreso de Valery (565/2 aprox) = 282.5 soles
        const ingresoValery = await db.collection('ingresos')
            .where('persona', '==', 'valery')
            .where('monto', '==', 282.5)
            .where('fecha', '>=', `${anio}-${mes.toString().padStart(2, '0')}-01`)
            .where('fecha', '<=', `${anio}-${mes.toString().padStart(2, '0')}-31`)
            .get();

        if (ingresoValery.empty) {
            await db.collection('ingresos').add({
                persona: 'valery',
                monto: 282.5,
                fecha: fechaISO
            });
            console.log('✅ Ingreso automático registrado: Valery');
        }
    }

    if (diaSemana === 1) { // Lunes
        // Registrar ingreso semanal de Valery (100 soles)
        const ingresoSemanalValery = await db.collection('ingresos')
            .where('persona', '==', 'valery')
            .where('monto', '==', 100)
            .where('fecha', '>=', `${anio}-${mes.toString().padStart(2, '0')}-01`)
            .where('fecha', '<=', `${anio}-${mes.toString().padStart(2, '0')}-31`)
            .get();

        if (ingresoSemanalValery.empty) {
            await db.collection('ingresos').add({
                persona: 'valery',
                monto: 100,
                fecha: fechaISO
            });
            console.log('✅ Ingreso semanal de Valery registrado');
        }
    }
}
async function registrarGastosFijos() {
    const fechaHoy = new Date();
    const dia = fechaHoy.getDate();
    const mes = fechaHoy.getMonth() + 1;
    const anio = fechaHoy.getFullYear();
    const fechaISO = fechaHoy.toISOString();

    // Gastos fijos a verificar
    const gastosFijos = [
        { persona: 'diego', monto: 34.95, categoria: 'celular', diaFijo: 5 },
        { persona: 'diego', monto: 96.00, categoria: 'deuda bbva', diaFijo: 5 },
        { persona: 'diego', monto: 20 * 3.8, categoria: 'chatgpt', diaFijo: 8 }, // 20 dólares * 3.8 soles/dólar
        { persona: 'diego', monto: 150.00, categoria: 'aporte casa', diaFijo: 3 }
    ];

    for (const gasto of gastosFijos) {
        if (dia === gasto.diaFijo) {
            const querySnapshot = await db.collection('gastos')
                .where('persona', '==', gasto.persona)
                .where('categoria', '==', gasto.categoria)
                .where('fecha', '>=', `${anio}-${mes.toString().padStart(2, '0')}-01`)
                .where('fecha', '<=', `${anio}-${mes.toString().padStart(2, '0')}-31`)
                .get();

            if (querySnapshot.empty) {
                await db.collection('gastos').add({
                    persona: gasto.persona,
                    monto: gasto.monto,
                    categoria: gasto.categoria,
                    fecha: fechaISO
                });
                console.log(`✅ Gasto fijo registrado: ${gasto.categoria}`);
            } else {
                console.log(`⏩ Gasto fijo ya registrado: ${gasto.categoria}`);
            }
        }
    }
}
async function registrarPasaje() {
    const { value: destino } = await Swal.fire({
        title: '¿A qué destino fuiste hoy?',
        input: 'select',
        inputOptions: {
            miraflores: 'Miraflores (27 soles)',
            pueblo_libre: 'Pueblo Libre (33 soles)',
            wilson: 'Wilson (12 soles)'
        },
        inputPlaceholder: 'Selecciona un destino',
        showCancelButton: true
    });

    if (destino) {
        let monto = 0;
        let categoria = 'pasaje';

        if (destino === 'miraflores') monto = 27;
        else if (destino === 'pueblo_libre') monto = 33;
        else if (destino === 'wilson') monto = 12;

        const fecha = new Date().toISOString();

        try {
            await db.collection('gastos').add({
                persona: 'diego',
                monto: monto,
                categoria: categoria,
                fecha: fecha
            });

            Swal.fire('✅ Registrado', `Pasaje a ${destino.replace('_', ' ')} registrado exitosamente.`, 'success');
        } catch (error) {
            console.error('❌ Error al registrar pasaje:', error);
        }
    }
}
function actualizarAhorrosEmergencia() {
    const ahorroDiegoElemento = document.getElementById('ahorro-diego');
    const ahorroValeryElemento = document.getElementById('ahorro-valery');

    if (ahorroDiegoElemento) ahorroDiegoElemento.textContent = ahorroEmergenciaDiego.toFixed(2);
    if (ahorroValeryElemento) ahorroValeryElemento.textContent = ahorroEmergenciaValery.toFixed(2);
}
async function calcularResumenMensual() {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString();

    let totalIngresos = 0;
    let totalGastos = 0;

    try {
        // Sumar ingresos
        const ingresosSnapshot = await db.collection('ingresos')
            .where('fecha', '>=', primerDiaMes)
            .where('fecha', '<=', ultimoDiaMes)
            .get();

        ingresosSnapshot.forEach(doc => {
            const ingreso = doc.data();
            totalIngresos += ingreso.monto;
        });

        // Sumar gastos
        const gastosSnapshot = await db.collection('gastos')
            .where('fecha', '>=', primerDiaMes)
            .where('fecha', '<=', ultimoDiaMes)
            .get();

        gastosSnapshot.forEach(doc => {
            const gasto = doc.data();
            totalGastos += gasto.monto;
        });

        // Ahorro = ingresos - gastos
        const ahorroMes = totalIngresos - totalGastos;

        // Mostrar en HTML
        document.getElementById('total-ingresos').textContent = totalIngresos.toFixed(2);
        document.getElementById('total-gastos').textContent = totalGastos.toFixed(2);
        document.getElementById('ahorro-mes').textContent = ahorroMes.toFixed(2);

        const saldoFinal = document.getElementById('saldo-final');
        saldoFinal.textContent = ahorroMes.toFixed(2);
        saldoFinal.style.color = ahorroMes >= 0 ? '#4caf50' : '#f44336'; // Verde o rojo según saldo

    } catch (error) {
        console.error('❌ Error al calcular resumen mensual:', error);
    }
}
