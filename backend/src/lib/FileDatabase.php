<?php
namespace App\Lib;

class FileDatabase {
    private $dataDir;
    
    public function __construct($dataDir = null) {
        $this->dataDir = $dataDir ?? __DIR__ . '/../../data';
        
        // Create data directory if it doesn't exist
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0755, true);
        }
    }
    
    /**
     * Get all records from a collection
     * 
     * @param string $collection Collection name
     * @return array Records
     */
    public function getAll($collection) {
        $file = $this->getCollectionFile($collection);
        
        if (!file_exists($file)) {
            return [];
        }
        
        $data = json_decode(file_get_contents($file), true);
        return $data ?: [];
    }
    
    /**
     * Get a record by ID
     * 
     * @param string $collection Collection name
     * @param mixed $id Record ID
     * @return array|null Record or null if not found
     */
    public function getById($collection, $id) {
        $records = $this->getAll($collection);
        
        foreach ($records as $record) {
            if ($record['id'] == $id) {
                return $record;
            }
        }
        
        return null;
    }
    
    /**
     * Insert a record
     * 
     * @param string $collection Collection name
     * @param array $data Record data
     * @return array Inserted record with ID
     */
    public function insert($collection, $data) {
        $records = $this->getAll($collection);
        
        // Generate ID
        $data['id'] = $this->generateId($records);
        
        // Add timestamps
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        $records[] = $data;
        
        $this->saveCollection($collection, $records);
        
        return $data;
    }
    
    /**
     * Update a record
     * 
     * @param string $collection Collection name
     * @param mixed $id Record ID
     * @param array $data New data
     * @return array|null Updated record or null if not found
     */
    public function update($collection, $id, $data) {
        $records = $this->getAll($collection);
        
        foreach ($records as $key => $record) {
            if ($record['id'] == $id) {
                // Preserve ID and created_at
                $data['id'] = $id;
                $data['created_at'] = $record['created_at'];
                $data['updated_at'] = date('Y-m-d H:i:s');
                
                $records[$key] = $data;
                
                $this->saveCollection($collection, $records);
                
                return $data;
            }
        }
        
        return null;
    }
    
    /**
     * Delete a record
     * 
     * @param string $collection Collection name
     * @param mixed $id Record ID
     * @return bool Success flag
     */
    public function delete($collection, $id) {
        $records = $this->getAll($collection);
        
        foreach ($records as $key => $record) {
            if ($record['id'] == $id) {
                unset($records[$key]);
                
                $this->saveCollection($collection, array_values($records));
                
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Query records by field value
     * 
     * @param string $collection Collection name
     * @param string $field Field name
     * @param mixed $value Field value
     * @return array Matching records
     */
    public function findBy($collection, $field, $value) {
        $records = $this->getAll($collection);
        $result = [];
        
        foreach ($records as $record) {
            if (isset($record[$field]) && $record[$field] == $value) {
                $result[] = $record;
            }
        }
        
        return $result;
    }
    
    /**
     * Query records by callback
     * 
     * @param string $collection Collection name
     * @param callable $callback Callback function
     * @return array Matching records
     */
    public function findWhere($collection, $callback) {
        $records = $this->getAll($collection);
        
        return array_filter($records, $callback);
    }
    
    /**
     * Get the file path for a collection
     * 
     * @param string $collection Collection name
     * @return string File path
     */
    private function getCollectionFile($collection) {
        return $this->dataDir . '/' . $collection . '.json';
    }
    
    /**
     * Save a collection to disk
     * 
     * @param string $collection Collection name
     * @param array $data Collection data
     * @return bool Success flag
     */
    private function saveCollection($collection, $data) {
        $file = $this->getCollectionFile($collection);
        
        return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    /**
     * Generate a new ID for a record
     * 
     * @param array $records Existing records
     * @return int New ID
     */
    private function generateId($records) {
        $maxId = 0;
        
        foreach ($records as $record) {
            if (isset($record['id']) && $record['id'] > $maxId) {
                $maxId = $record['id'];
            }
        }
        
        return $maxId + 1;
    }
} 