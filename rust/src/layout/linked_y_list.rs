pub struct LinkedYList {
    pub index: usize,
    y: f32,
    next: Option<Box<LinkedYList>>,
}

impl LinkedYList {
    pub fn new(index: usize, pos_y: f32) -> Self {
        LinkedYList {
            index,
            y: pos_y,
            next: None,
        }
    }

    pub fn bottom(&self) -> f32 {
        self.y
    }

    pub fn update(self, index: usize, y: f32) -> Self {
        let mut list = self;

        while list.y <= y {
            if let Some(next) = list.next.take() {
                list = *next;
            } else {
                return LinkedYList {
                    index,
                    y,
                    next: None,
                };
            }
        }

        LinkedYList {
            index,
            y,
            next: Some(Box::new(list)),
        }
    }

    pub fn pop(mut self) -> Option<Self> {
        self.next.take().map(|next| *next)
    }
}
