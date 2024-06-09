pub struct GenerateID {
    id: i32,
}

impl GenerateID {
    pub fn new() -> GenerateID {
        GenerateID { id: -1 }
    }

    pub fn get_next_id(&mut self) -> i32 {
        self.id += 1;
        self.id
    }
}
