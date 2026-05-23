import joiToSwagger from 'joi-to-swagger';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modulesDir = join(__dirname, '../modules');

/**
 * Check if an exported value is a Joi schema
 * Joi schemas have validate() and describe() methods
 */
const isJoiSchema = (value) => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.validate === 'function' &&
    typeof value.describe === 'function'
  );
};

/**
 * Convert a schema name (e.g., 'ingestSchema') to component name (e.g., 'IngestRequest')
 * Rules:
 * - Remove 'Schema' suffix if present
 * - Convert to PascalCase
 * - Special handling for known patterns: (create|update|start|traverse|ask) → add suffix
 */
const getComponentName = (fileName, schemaName) => {
  let name = schemaName.replace(/Schema$/, '');
  
  return fileName + '.' + name;
};

/**
 * Recursively find all validation files in modules directory
 */
const findValidationFiles = (dir) => {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findValidationFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.validation.js')) {
      const fileName = entry.name.replace('.validation.js', '').toLowerCase().replace(/_/g, '');
      files.push({ name: fileName, path: fullPath });
    }
  }
  
  return files;
};

/**
 * Dynamically load and discover all Joi schemas from validation files
 */
const loadSchemas = async () => {
  const schemas = {};
  const validationFiles = findValidationFiles(modulesDir);
  
  for (const file of validationFiles) {
    const fileName = file.name;
    const filePath = file.path;

    const fileUrl = `file://${filePath}`;
    const module = await import(fileUrl);
    
    // Extract all Joi schema exports
    for (const [exportName, exportValue] of Object.entries(module)) {
      if (isJoiSchema(exportValue)) {
        const componentName = getComponentName(fileName, exportName);
        const { swagger } = joiToSwagger(exportValue);
        schemas[componentName] = swagger;
      }
    }
  }
  
  return schemas;
};

// Load and export schemas
export const swaggerSchemas = await loadSchemas();

export default swaggerSchemas;
