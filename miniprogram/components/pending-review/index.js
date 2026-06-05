Component({
    data: {
      reviewers: [
        {
          id: 1,
          name: "Alice",
          avatar: "https://dummyimage.com/100x100/ddd/111.png&text=A",
          score: 88,
          speed: 92,
          approved: false
        },
        {
          id: 2,
          name: "Bob",
          avatar: "https://dummyimage.com/100x100/ddd/111.png&text=B",
          score: 76,
          speed: 85,
          approved: false
        },
        {
          id: 3,
          name: "Cindy",
          avatar: "https://dummyimage.com/100x100/ddd/111.png&text=C",
          score: 94,
          speed: 90,
          approved: false
        }
      ]
    },
  
    methods: {
  
      onBack() {
        this.triggerEvent("close");
      },
  
      onSwitch(e) {
        const index = e.currentTarget.dataset.index;
        const key = `reviewers[${index}].approved`;
        const value = !this.data.reviewers[index].approved;
  
        this.setData({
          [key]: value
        });
      }
  
    }
  });