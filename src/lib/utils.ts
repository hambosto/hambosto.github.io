import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// =========================================
// FORMATTING
// =========================================

export const formatUptime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// =========================================
// MATH & NUMBERS
// =========================================

export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const KERNEL_SOURCE = `
/*
 * linux/kernel/sched.c
 *
 * Kernel scheduler and related syscalls
 */

#include <linux/sched.h>
#include <linux/spinlock.h>
#include <linux/interrupt.h>

/*
 * Context switch management
 */
struct task_struct *__switch_to(struct task_struct *prev, struct task_struct *next) {
    struct thread_struct *prev_thread = &prev->thread;
    struct thread_struct *next_thread = &next->thread;
    
    // Save floating point state
    if (prev->thread.flags & THREAD_FPU)
        save_fpu(prev);
        
    // Switch kernel stack
    cpu_current_thread = next_thread;
    
    // Load new page directory
    if (next->mm != prev->mm)
        switch_mm(prev->mm, next->mm, next);
        
    return prev;
}

void schedule(void) {
    struct task_struct *prev, *next;
    struct list_head *tmp;
    int this_cpu = smp_processor_id();
    struct runqueue *rq = &runqueues[this_cpu];
    
    spin_lock_irq(&rq->lock);
    
    prev = current;
    next = pick_next_task(rq, prev);
    
    if (likely(prev != next)) {
        rq->nr_switches++;
        rq->curr = next;
        
        context_switch(rq, prev, next);
        
        // Barrier for memory consistency
        wmb();
    }
    
    spin_unlock_irq(&rq->lock);
}

/*
 * Memory management subsystem initialization
 */
void __init mm_init(void) {
    // Initialize page allocator
    page_alloc_init();
    
    // Set up kernel page tables
    init_kernel_pgtable();
    
    // Initialize slab allocator
    kmem_cache_init();
    
    printk(KERN_INFO "Memory: %luk/%luk available\\n",
           nr_free_pages() << (PAGE_SHIFT-10),
           num_physpages << (PAGE_SHIFT-10));
}

// Security subsystem hooks
int security_socket_create(int family, int type, int protocol, int kern) {
    return call_int_hook(socket_create, 0, family, type, protocol, kern);
}

// Network stack initialization
void __init net_init(void) {
    proto_init();
    dev_init();
    sock_init();
    
    printk(KERN_INFO "Networking initialized\\n");
}
`;
