-- Tabla de loteamientos (ej: barrios cerrados, urbanizaciones)
CREATE TABLE loteamientos (
    id CHAR(36) PRIMARY KEY,                     -- UUID generado desde app o con UUID()
    external_id VARCHAR(100) NOT NULL,           -- ID del KML o de referencia externa
    nombre VARCHAR(255) NOT NULL,                -- Nombre del loteamiento o barrio
    descripcion TEXT,                            -- Opcional
    geojson JSON NOT NULL,                       -- GeoJSON del polígono del loteamiento

    -- Centroide
    centroide_lat DECIMAL(10,7) NOT NULL,
    centroide_lng DECIMAL(10,7) NOT NULL,

    -- Bounding Box
    min_lat DECIMAL(10,7) NOT NULL,
    min_lng DECIMAL(10,7) NOT NULL,
    max_lat DECIMAL(10,7) NOT NULL,
    max_lng DECIMAL(10,7) NOT NULL,

    -- Métricas
    area_m2 DECIMAL(18,2) NOT NULL,
    area_m2_rounded DECIMAL(18,2) NOT NULL,
    perimeter_m DECIMAL(18,2) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de lotes (hijos de un loteamiento)
CREATE TABLE lotes (
    id CHAR(36) PRIMARY KEY,                     -- UUID
    loteamiento_id CHAR(36) NOT NULL,            -- FK al loteamiento
    external_id VARCHAR(100) NOT NULL,           -- ID de referencia del lote (ej: nombre en el KML)
    nombre VARCHAR(255) NOT NULL,                -- Nombre o código del lote
    descripcion TEXT,                            -- Opcional
    geojson JSON NOT NULL,                       -- GeoJSON del polígono del lote

    -- Centroide
    centroide_lat DECIMAL(10,7) NOT NULL,
    centroide_lng DECIMAL(10,7) NOT NULL,

    -- Bounding Box
    min_lat DECIMAL(10,7) NOT NULL,
    min_lng DECIMAL(10,7) NOT NULL,
    max_lat DECIMAL(10,7) NOT NULL,
    max_lng DECIMAL(10,7) NOT NULL,

    -- Métricas
    area_m2 DECIMAL(18,2) NOT NULL,
    area_m2_rounded DECIMAL(18,2) NOT NULL,
    perimeter_m DECIMAL(18,2) NOT NULL,
    lados JSON NOT NULL,                         -- Lista de lados en metros (array JSON)

    -- Estado (ej: disponible, reservado, vendido)
    estado VARCHAR(50) DEFAULT 'disponible',

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Relaciones
    CONSTRAINT fk_loteamiento FOREIGN KEY (loteamiento_id) REFERENCES loteamientos(id) ON DELETE CASCADE
);
